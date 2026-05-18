-- Vista 1: Resumen financiero mensual
CREATE MATERIALIZED VIEW resumen_financiero_mensual AS
SELECT
    t."userId",
    EXTRACT(YEAR FROM t.date)::INT AS year,
    EXTRACT(MONTH FROM t.date)::INT AS month,
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS "totalIncome",
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS "totalExpense",
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS margin,
    CASE
        WHEN SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) > 0
        THEN ROUND(((SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END)) / SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) * 100)::NUMERIC, 2)
        ELSE 0
    END AS "marginPct"
FROM transactions t
GROUP BY t."userId", EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date);

-- Vista 2: Gastos por categoria
CREATE MATERIALIZED VIEW gastos_por_categoria AS
SELECT
    t."userId",
    c.name AS "categoryName",
    SUM(t.amount) AS "totalAmount",
    ROUND((SUM(t.amount) / NULLIF(totals.total, 0) * 100)::NUMERIC, 2) AS percentage,
    COUNT(*)::INT AS "transactionCount"
FROM transactions t
JOIN categories c ON t."categoryId" = c.id
JOIN (
    SELECT "userId", SUM(amount) AS total
    FROM transactions
    WHERE type = 'EXPENSE'
    GROUP BY "userId"
) totals ON t."userId" = totals."userId"
WHERE t.type = 'EXPENSE'
GROUP BY t."userId", c.name, totals.total;

-- Vista 3: Tendencia semanal
CREATE MATERIALIZED VIEW tendencia_semanal AS
SELECT
    t."userId",
    DATE_TRUNC('week', t.date)::DATE AS "weekStart",
    (DATE_TRUNC('week', t.date) + INTERVAL '6 days')::DATE AS "weekEnd",
    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS income,
    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS expense
FROM transactions t
GROUP BY t."userId", DATE_TRUNC('week', t.date);

-- Refresh automatico con trigger
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW resumen_financiero_mensual;
    REFRESH MATERIALIZED VIEW gastos_por_categoria;
    REFRESH MATERIALIZED VIEW tendencia_semanal;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_views
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_materialized_views();
