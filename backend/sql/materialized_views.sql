-- ============================================
-- VoiceFinance AI - Vistas Materializadas
-- Autor: Victor (Persona E - Base de Datos)
-- Descripcion: Vistas pre-calculadas para reportes
-- financieros con refresh automatico via trigger
-- ============================================

-- Vista 1: Resumen financiero mensual por usuario
-- Calcula ingresos, gastos y margen por mes
CREATE MATERIALIZED VIEW IF NOT EXISTS resumen_financiero_mensual AS
SELECT
    t."userId",
    EXTRACT(YEAR FROM t.date)::INT AS year,
    EXTRACT(MONTH FROM t.date)::INT AS month,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) -
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS margin,
    COUNT(*) AS total_transactions
FROM transactions t
GROUP BY t."userId", EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)
WITH DATA;

-- Vista 2: Gastos por categoria con porcentajes
-- Muestra el desglose de gastos por categoria para cada usuario
CREATE MATERIALIZED VIEW IF NOT EXISTS gastos_por_categoria AS
SELECT
    t."userId",
    c.name AS category_name,
    t.type,
    SUM(t.amount) AS total_amount,
    COUNT(*) AS transaction_count,
    ROUND(
        (SUM(t.amount) * 100.0 /
        NULLIF(SUM(SUM(t.amount)) OVER (PARTITION BY t."userId", t.type), 0))::NUMERIC,
        2
    ) AS percentage
FROM transactions t
JOIN categories c ON t."categoryId" = c.id
GROUP BY t."userId", c.name, t.type
WITH DATA;

-- Vista 3: Tendencia semanal de ingresos y gastos
-- Permite visualizar patrones semanales
CREATE MATERIALIZED VIEW IF NOT EXISTS tendencia_semanal AS
SELECT
    t."userId",
    DATE_TRUNC('week', t.date)::DATE AS week_start,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS weekly_income,
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS weekly_expense,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) -
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS weekly_balance,
    COUNT(*) AS weekly_transactions
FROM transactions t
GROUP BY t."userId", DATE_TRUNC('week', t.date)
WITH DATA;

-- ============================================
-- Funcion para refrescar todas las vistas
-- ============================================
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY resumen_financiero_mensual;
    REFRESH MATERIALIZED VIEW CONCURRENTLY gastos_por_categoria;
    REFRESH MATERIALIZED VIEW CONCURRENTLY tendencia_semanal;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Indexes unicos requeridos para CONCURRENTLY
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_rfm_unique
    ON resumen_financiero_mensual ("userId", year, month);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gpc_unique
    ON gastos_por_categoria ("userId", category_name, type);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ts_unique
    ON tendencia_semanal ("userId", week_start);

-- ============================================
-- Trigger: refresca vistas al modificar transacciones
-- ============================================
DROP TRIGGER IF EXISTS trg_refresh_views ON transactions;

CREATE TRIGGER trg_refresh_views
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_materialized_views();
