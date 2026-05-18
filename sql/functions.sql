-- Funcion 1: Calcular margen mensual
CREATE OR REPLACE FUNCTION calcular_margen_mensual(p_user_id TEXT, p_year INT, p_month INT)
RETURNS TABLE(total_income NUMERIC, total_expense NUMERIC, margin NUMERIC, margin_pct NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS margin,
        CASE
            WHEN SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) > 0
            THEN ROUND(((SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END)) / SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) * 100)::NUMERIC, 2)
            ELSE 0
        END AS margin_pct
    FROM transactions t
    WHERE t."userId" = p_user_id
      AND EXTRACT(YEAR FROM t.date) = p_year
      AND EXTRACT(MONTH FROM t.date) = p_month;
END;
$$ LANGUAGE plpgsql;

-- Funcion 2: Generar resumen mensual
CREATE OR REPLACE FUNCTION generar_resumen_mensual(p_user_id TEXT, p_year INT, p_month INT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO monthly_summaries ("userId", "categoryId", year, month, "totalAmount", "transactionCount", "avgAmount")
    SELECT
        t."userId",
        t."categoryId",
        p_year,
        p_month,
        SUM(t.amount),
        COUNT(*)::INT,
        ROUND((SUM(t.amount) / COUNT(*))::NUMERIC, 2)
    FROM transactions t
    WHERE t."userId" = p_user_id
      AND EXTRACT(YEAR FROM t.date) = p_year
      AND EXTRACT(MONTH FROM t.date) = p_month
    GROUP BY t."userId", t."categoryId"
    ON CONFLICT ("userId", "categoryId", year, month)
    DO UPDATE SET
        "totalAmount" = EXCLUDED."totalAmount",
        "transactionCount" = EXCLUDED."transactionCount",
        "avgAmount" = EXCLUDED."avgAmount";
END;
$$ LANGUAGE plpgsql;

-- Funcion 3: Detectar alertas
CREATE OR REPLACE FUNCTION detectar_alertas(p_user_id TEXT)
RETURNS VOID AS $$
DECLARE
    v_income NUMERIC;
    v_expense NUMERIC;
    v_margin_pct NUMERIC;
    v_prev_expense NUMERIC;
    v_cost_increase NUMERIC;
BEGIN
    SELECT
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)
    INTO v_income, v_expense
    FROM transactions
    WHERE "userId" = p_user_id
      AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW())
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW());

    IF v_income > 0 THEN
        v_margin_pct := ((v_income - v_expense) / v_income) * 100;
    ELSE
        v_margin_pct := 0;
    END IF;

    SELECT COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)
    INTO v_prev_expense
    FROM transactions
    WHERE "userId" = p_user_id
      AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW() - INTERVAL '1 month')
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW() - INTERVAL '1 month');

    IF v_prev_expense > 0 THEN
        v_cost_increase := ((v_expense - v_prev_expense) / v_prev_expense) * 100;
    ELSE
        v_cost_increase := 0;
    END IF;

    IF v_cost_increase > 15 THEN
        INSERT INTO alerts (id, "userId", message, type, "isRead", "createdAt")
        VALUES (gen_random_uuid(), p_user_id, 'Alerta: Los costos aumentaron ' || ROUND(v_cost_increase::NUMERIC, 1) || '% respecto al mes anterior.', 'COST_INCREASE', false, NOW());
    END IF;

    IF v_margin_pct < 20 THEN
        INSERT INTO alerts (id, "userId", message, type, "isRead", "createdAt")
        VALUES (gen_random_uuid(), p_user_id, 'Alerta: Tu margen de ganancia es ' || ROUND(v_margin_pct::NUMERIC, 1) || '%, por debajo del 20% recomendado.', 'LOW_MARGIN', false, NOW());
    END IF;

    IF (v_income - v_expense) < 0 THEN
        INSERT INTO alerts (id, "userId", message, type, "isRead", "createdAt")
        VALUES (gen_random_uuid(), p_user_id, 'Alerta: Tu flujo de caja es negativo este mes. Gastos superan ingresos por ' || ROUND(ABS(v_income - v_expense)::NUMERIC, 2), 'NEGATIVE_CASH_FLOW', false, NOW());
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Funcion 4: Obtener balance actual
CREATE OR REPLACE FUNCTION obtener_balance_actual(p_user_id TEXT)
RETURNS TABLE(income DOUBLE PRECISION, expense DOUBLE PRECISION, balance DOUBLE PRECISION) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS expense,
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS balance
    FROM transactions t
    WHERE t."userId" = p_user_id
      AND EXTRACT(YEAR FROM t.date) = EXTRACT(YEAR FROM NOW())
      AND EXTRACT(MONTH FROM t.date) = EXTRACT(MONTH FROM NOW());
END;
$$ LANGUAGE plpgsql;
