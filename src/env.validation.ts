import { IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";
import { plainToClass } from "class-transformer";

class EnvironmentVariables {
    @IsNumber()
    @IsNotEmpty()
    public PORT: number;
    @IsString()
    @IsNotEmpty()
    public POSTGRES_HOST: string;
    @IsNumber()
    @IsNotEmpty()
    public POSTGRES_PORT: number;
    @IsNotEmpty()
    @IsString()
    POSTGRES_USER: string;
    @IsString()
    @IsNotEmpty()
    POSTGRES_PASSWORD: string;
    @IsString()
    @IsNotEmpty()
    public POSTGRES_DB: string;
    @IsString()
    @IsNotEmpty()
    ELASTICSEARCH_NODE: string;
    @IsString()
    @IsNotEmpty()
    ELASTICSEARCH_USERNAME: string;
    @IsString()
    @IsNotEmpty()
    ELASTICSEARCH_PASSWORD: string;
    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_TOKEN_SECRET: string;
    @IsString()
    @IsNotEmpty()
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
    @IsString()
    @IsNotEmpty()
    JWT_REFRESH_TOKEN_SECRET: string;
    @IsString()
    @IsNotEmpty()
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
    @IsString()
    @IsNotEmpty()
    JWT_VERIFICATION_TOKEN_SECRET: string;
    @IsString()
    @IsNotEmpty()
    JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(`Config validation error: ${errors}`);
    }
    return validatedConfig;

}