import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseLogger } from "src/database/database-logger";

class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        const options: TypeOrmModuleOptions = {
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            username: configService.get('database.username'),
            password: configService.get('database.password'),
            database: configService.get('database.database'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get('database.synchronize'),

        }

        const isLogging = configService.get('database.logging') || false;
        if (!isLogging) {
            return options;
        }

        return {
            ...options,
            logger: new DatabaseLogger()
        }
    }
}
export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
};

export default registerAs('typeorm', () => ({
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'false' ? false : true,
    logging: process.env.TYPEORM_LOGGING === 'true' ? true : false,
}));