-- ============================================
-- VoiceFinance AI - Funciones SQL
-- Autor: Victor (Persona E - Base de Datos)
-- Descripcion: Funciones de logica de negocio
-- para calculos financieros, resumenes, alertas
-- y consultas de balance en tiempo real
-- ============================================

-- ============================================
-- Funcion 1: calcular_margen_mensual
-- Calcula ingresos, gastos y margen porcentual
-- de un usuario en un mes especifico
-- ============================================
CREATE OR REPLACE FUNCTION calcular_margen_mensual(
    p_user_id TEXT,
    p_year INT,
    p_month INT
)
RETURNS TABLE(
    income DOUBLE PRECISION,
    expense DOUBLE PRECISION,
    margin DOUBLE PRECISION,
    margin_pct DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0)::DOUBLE PRECISION AS income,
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)::DOUBLE PRECISION AS expense,
        (COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0))::DOUBLE PRECISION AS margin,
        CASE
            WHEN COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) = 0 THEN 0
            ELSE ROUND(
                ((COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) -
                  COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)) * 100.0 /
                 COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0))::NUMERIC,
                2
            )::DOUBLE PRECISION
        END AS margin_pct
    FROM transactions t
    WHERE t."userId" = p_user_id
        AND EXTRACT(YEAR FROM t.date) = p_year
        AND EXTRACT(MONTH FROM t.date) = p_month;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Funcion 2: generar_resumen_mensual
-- Inserta o actualiza el resumen mensual de un
-- usuario en la tabla monthly_summaries por categoria
-- =============================================

CREATE OR REPLACE FUNCTION generar_resumen_mensual(
    p_user_id TEXT,
    p_year INT,
    p_month INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO monthly_summaries ("userId", "categoryId", "year", "month", "totalAmount", "transactionCount", "avgAmount")
    SELECT
        p_user_id,
        t."categoryId",
        p_year,
        p_month,
        COALESCE(SUM(t.amount), 0) AS "totalAmount",
        COUNT(*) AS "transactionCount",
        COALESCE(AVG(t.amount), 0) AS "avgAmount"
    FROM transactions t
    WHERE t."userId" = p_user_id
      AND EXTRACT(YEAR FROM t.date) = p_year
      AND EXTRACT(MONTH FROM t.date) = p_month
    GROUP BY t."categoryId"
    ON CONFLICT ("userId", "categoryId", "year", "month")
    DO UPDATE SET
        "totalAmount" = EXCLUDED."totalAmount",
        "transactionCount" = EXCLUDED."transactionCount",
        "avgAmount" = EXCLUDED."avgAmount";
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Funcion 3: detectar_alertas
-- Analiza las transacciones del usuario y genera
-- alertas automaticas por incremento de costos,
-- margen bajo o flujo de caja negativo
-- ============================================
CREATE OR REPLACE FUNCTION detectar_alertas(
    p_user_id TEXT
)
RETURNS VOID AS $$
DECLARE
    v_current_month INT := EXTRACT(MONTH FROM NOW())::INT;
    v_current_year INT := EXTRACT(YEAR FROM NOW())::INT;
    v_prev_month INT;
    v_prev_year INT;
    v_current_expense DOUBLE PRECISION;
    v_prev_expense DOUBLE PRECISION;
    v_margin_pct DOUBLE PRECISION;
    v_balance DOUBLE PRECISION;
    v_target_margin DOUBLE PRECISION;
BEGIN
    -- Calcular mes anterior
    IF v_current_month = 1 THEN
        v_prev_month := 12;
        v_prev_year := v_current_year - 1;
    ELSE
        v_prev_month := v_current_month - 1;
        v_prev_year := v_current_year;
    END IF;

    -- Obtener gasto actual y anterior
    SELECT COALESCE(SUM(amount), 0) INTO v_current_expense
    FROM transactions
    WHERE "userId" = p_user_id AND type = 'EXPENSE'
        AND EXTRACT(YEAR FROM date) = v_current_year
        AND EXTRACT(MONTH FROM date) = v_current_month;

    SELECT COALESCE(SUM(amount), 0) INTO v_prev_expense
    FROM transactions
    WHERE "userId" = p_user_id AND type = 'EXPENSE'
        AND EXTRACT(YEAR FROM date) = v_prev_year
        AND EXTRACT(MONTH FROM date) = v_prev_month;

    -- Obtener margen actual
    SELECT margin_pct INTO v_margin_pct
    FROM calcular_margen_mensual(p_user_id, v_current_year, v_current_month);

    -- Obtener balance
    SELECT balance INTO v_balance
    FROM obtener_balance_actual(p_user_id);

    -- Obtener target margin del usuario
    SELECT "targetMarginPct" INTO v_target_margin
    FROM users WHERE id = p_user_id;

    -- Alerta 1: Incremento de costos (>20% vs mes anterior)
    IF v_prev_expense > 0 AND ((v_current_expense - v_prev_expense) / v_prev_expense * 100) > 20 THEN
        INSERT INTO alerts ("id", "userId", "type", "message", "isRead", "createdAt")
        VALUES (
            gen_random_uuid()::TEXT,
            p_user_id,
            'COST_INCREASE',
            'Tus gastos aumentaron mas del 20% respecto al mes anterior. Gasto actual: $' || ROUND(v_current_expense::NUMERIC, 2) || ' vs anterior: $' || ROUND(v_prev_expense::NUMERIC, 2),
            false,
            NOW()
        );
    END IF;

    -- Alerta 2: Margen bajo (menor al target del usuario)
    IF v_margin_pct IS NOT NULL AND v_target_margin IS NOT NULL AND v_margin_pct < v_target_margin THEN
        INSERT INTO alerts ("id", "userId", "type", "message", "isRead", "createdAt")
        VALUES (
            gen_random_uuid()::TEXT,
            p_user_id,
            'LOW_MARGIN',
            'Tu margen actual (' || ROUND(v_margin_pct::NUMERIC, 1) || '%) esta por debajo de tu objetivo (' || ROUND(v_target_margin::NUMERIC, 1) || '%)',
            false,
            NOW()
        );
    END IF;

    -- Alerta 3: Flujo de caja negativo
    IF v_balance < 0 THEN
        INSERT INTO alerts ("id", "userId", "type", "message", "isRead", "createdAt")
        VALUES (
            gen_random_uuid()::TEXT,
            p_user_id,
            'CASH_FLOW',
            'Tu balance es negativo: $' || ROUND(v_balance::NUMERIC, 2) || '. Revisa tus gastos.',
            false,
            NOW()
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Funcion 4: obtener_balance_actual
-- Retorna el balance en tiempo real de un usuario
-- (total ingresos - total gastos)
-- ============================================
CREATE OR REPLACE FUNCTION obtener_balance_actual(
    p_user_id TEXT
)
RETURNS TABLE(
    income DOUBLE PRECISION,
    expense DOUBLE PRECISION,
    balance DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0)::DOUBLE PRECISION AS income,
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0)::DOUBLE PRECISION AS expense,
        (COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0))::DOUBLE PRECISION AS balance
    FROM transactions t
    WHERE t."userId" = p_user_id;
END;
$$ LANGUAGE plpgsql;
