import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    database: process.env.POSTGRES_DB || 'postgres',
    synchronize: process.env.DATABASE_SYNCHRONIZE || true,
}));