#!/bin/bash
# ============================================
# VoiceFinance AI - Script de Restauracion
# Autor: Victor (Persona E - Base de Datos)
# Descripcion: Restaura la base de datos desde
# un archivo de backup comprimido (.sql.gz)
# generado por backup.sh
# ============================================

# Configuracion
# Cargar variables desde .env si existe
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

CONTAINER_NAME="${CONTAINER_NAME:-vf-postgres}"
DB_NAME="${DB_NAME:-voicefinance}"
DB_USER="${DB_USER:-postgres}"
BACKUP_DIR="./backups"

echo "=== VoiceFinance - Restauracion de Base de Datos ==="
echo ""

# Verificar que se paso un archivo como argumento
if [ -z "$1" ]; then
    echo "Uso: ./scripts/restore.sh <archivo_backup>"
    echo ""
    echo "Backups disponibles:"
    ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null || echo "  No hay backups disponibles."
    exit 1
fi

BACKUP_FILE="$1"

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: No se encontro el archivo '$BACKUP_FILE'"
    exit 1
fi

# Verificar que el contenedor esta corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "ERROR: El contenedor '$CONTAINER_NAME' no esta corriendo."
    echo "Inicia Docker Desktop y verifica que el contenedor este activo."
    exit 1
fi

echo "ADVERTENCIA: Esto reemplazara todos los datos actuales de '$DB_NAME'."
read -p "¿Estas seguro? (s/n): " CONFIRM

if [ "$CONFIRM" != "s" ]; then
    echo "Restauracion cancelada."
    exit 0
fi

echo ""
echo "Restaurando desde: $BACKUP_FILE"
echo "Fecha: $(date)"

# Restaurar: descomprimir y ejecutar SQL
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "Restauracion exitosa."
else
    echo ""
    echo "ERROR: La restauracion fallo."
    exit 1
fi
