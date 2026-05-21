#!/bin/bash
# ============================================
# VoiceFinance AI - Script de Mantenimiento
# Autor: Victor (Persona E - Base de Datos)
# Descripcion: Ejecuta tareas de mantenimiento
# de PostgreSQL: VACUUM ANALYZE para optimizar
# rendimiento, refresca vistas materializadas
# y muestra el tamano de las tablas
# ============================================

# Configuracion
# Cargar variables desde .env si existe
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

CONTAINER_NAME="${CONTAINER_NAME:-vf-postgres}"
DB_NAME="${DB_NAME:-voicefinance}"
DB_USER="${DB_USER:-postgres}"

echo "=== VoiceFinance - Mantenimiento de Base de Datos ==="
echo "Fecha: $(date)"
echo ""

# Verificar que el contenedor esta corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "ERROR: El contenedor '$CONTAINER_NAME' no esta corriendo."
    echo "Inicia Docker Desktop y verifica que el contenedor este activo."
    exit 1
fi

# 1. VACUUM ANALYZE - Optimizar tablas
echo "--- 1. VACUUM ANALYZE (optimizando tablas) ---"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "
    VACUUM ANALYZE transactions;
    VACUUM ANALYZE categories;
    VACUUM ANALYZE monthly_summaries;
    VACUUM ANALYZE alerts;
    VACUUM ANALYZE recommendations;
    VACUUM ANALYZE users;
"
echo "VACUUM ANALYZE completado."
echo ""

# 2. Refrescar vistas materializadas
echo "--- 2. Refrescando vistas materializadas ---"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "
    REFRESH MATERIALIZED VIEW CONCURRENTLY resumen_financiero_mensual;
    REFRESH MATERIALIZED VIEW CONCURRENTLY gastos_por_categoria;
    REFRESH MATERIALIZED VIEW CONCURRENTLY tendencia_semanal;
"
echo "Vistas materializadas refrescadas."
echo ""

# 3. Monitoreo - Tamano de tablas
echo "--- 3. Tamano de tablas ---"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "
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
