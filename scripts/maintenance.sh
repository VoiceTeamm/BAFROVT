#!/bin/bash
# Script de mantenimiento semanal para VoiceFinance AI
# Uso: bash scripts/maintenance.sh

echo "=== Mantenimiento VoiceFinance ==="
echo "Fecha: $(date)"
echo ""

echo "1. Ejecutando VACUUM ANALYZE en tablas principales..."
docker exec vf-postgres psql -U postgres -d voicefinance -c "VACUUM ANALYZE transactions;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "VACUUM ANALYZE categories;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "VACUUM ANALYZE alerts;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "VACUUM ANALYZE monthly_summaries;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "VACUUM ANALYZE agent_messages;"
echo ""

echo "2. Refrescando vistas materializadas..."
docker exec vf-postgres psql -U postgres -d voicefinance -c "REFRESH MATERIALIZED VIEW resumen_financiero_mensual;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "REFRESH MATERIALIZED VIEW gastos_por_categoria;"
docker exec vf-postgres psql -U postgres -d voicefinance -c "REFRESH MATERIALIZED VIEW tendencia_semanal;"
echo ""

echo "3. Monitoreo de tamano de tablas..."
docker exec vf-postgres psql -U postgres -d voicefinance -c "
SELECT
    relname AS tabla,
    pg_size_pretty(pg_total_relation_size(relid)) AS tamano_total,
    pg_size_pretty(pg_relation_size(relid)) AS tamano_datos,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS tamano_indices
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
"
echo ""
echo "=== Mantenimiento completado ==="
