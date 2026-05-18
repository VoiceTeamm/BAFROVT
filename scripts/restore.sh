#!/bin/bash
# Script de restauracion para VoiceFinance AI
# Uso: bash scripts/restore.sh backups/voicefinance_20260518.sql.gz

if [ -z "$1" ]; then
    echo "Uso: bash scripts/restore.sh <archivo_backup.sql.gz>"
    echo "Backups disponibles:"
    ls -lh backups/*.sql.gz 2>/dev/null || echo "  No hay backups"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Archivo no encontrado: $BACKUP_FILE"
    exit 1
fi

echo "ADVERTENCIA: Esto reemplazara toda la base de datos actual."
read -p "Continuar? (s/n): " CONFIRM

if [ "$CONFIRM" != "s" ]; then
    echo "Restauracion cancelada."
    exit 0
fi

echo "Restaurando desde $BACKUP_FILE..."
gunzip -c $BACKUP_FILE | docker exec -i vf-postgres psql -U postgres -d voicefinance

if [ $? -eq 0 ]; then
    echo "Restauracion completada exitosamente."
else
    echo "Error: La restauracion fallo."
    exit 1
fi
