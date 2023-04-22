import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { validate } from './env.validation';
import databaseConfig from './config/database.config';
import typeormConfig from './config/typeorm.config';
import jwtConfig from './config/jwt.config';
import elasticSearchConfig from './config/elastic-search.config';
import { CourseModule } from './features/learn/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate,
      load: [
        databaseConfig,
        typeormConfig,
        jwtConfig,
        elasticSearchConfig
      ]

    }),
    DatabaseModule,
    CourseModule,
    UserModule,
    AuthenticationModule


  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
