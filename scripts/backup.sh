#!/bin/bash
# ============================================
# VoiceFinance AI - Script de Backup
# Autor: Victor (Persona E - Base de Datos)
# Descripcion: Genera un respaldo comprimido
# de la base de datos PostgreSQL usando
# pg_dump dentro del contenedor Docker
# ============================================

# Configuracion
CONTAINER_NAME="vf-postgres"
DB_NAME="voicefinance"
DB_USER="postgres"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

echo "=== VoiceFinance - Backup de Base de Datos ==="
echo "Fecha: $(date)"
echo "Base de datos: $DB_NAME"
echo "Contenedor: $CONTAINER_NAME"
echo ""

# Verificar que el contenedor esta corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "ERROR: El contenedor '$CONTAINER_NAME' no esta corriendo."
    echo "Inicia Docker Desktop y verifica que el contenedor este activo."
    exit 1
fi

# Ejecutar backup
echo "Generando backup..."
docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

# Verificar resultado
if [ $? -eq 0 ] && [ -s "$BACKUP_FILE" ]; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup exitoso: $BACKUP_FILE ($FILE_SIZE)"
else
    echo "ERROR: El backup fallo."
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Eliminar backups antiguos (mas de 7 dias)
echo ""
echo "Limpiando backups antiguos (>7 dias)..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete
echo "Listo."
