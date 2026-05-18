#!/bin/bash
# Script de backup para VoiceFinance AI
# Uso: bash scripts/backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/voicefinance_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR

echo "Iniciando backup de VoiceFinance..."
docker exec vf-postgres pg_dump -U postgres -d voicefinance | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup completado: $BACKUP_FILE"
    echo "Tamano: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "Error: El backup fallo"
    exit 1
fi
