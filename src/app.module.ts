import './boilerplate.polyfill';

// import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AssignmentModule } from './modules/assignment/assignment.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { GradeModule } from './modules/grade/grade.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    GradeModule,
    CourseModule,
    AssignmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    // I18nModule.forRootAsync({
    //   useFactory: (configService: ApiConfigService) => ({
    //     fallbackLanguage: configService.fallbackLanguage,
    //     loaderOptions: {
    //       path: path.join(__dirname, '/i18n/'),
    //       watch: configService.isDevelopment,
    //     },
    //     resolvers: [
    //       { use: QueryResolver, options: ['lang'] },
    //       AcceptLanguageResolver,
    //       new HeaderResolver(['x-lang']),
    //     ],
    //   }),
    //   imports: [SharedModule],
    //   inject: [ApiConfigService],
    // }),
  ],
  providers: [],
})
export class AppModule {}
