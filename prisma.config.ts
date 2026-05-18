import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Esto hace que Prisma lea el archivo .env al inicio
dotenv.config();

export default defineConfig({
    datasource: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL!, // El '!' asegura que no sea null
    },
});