import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { getGqlConfig } from './config/graphql.config';
import { ApolloDriver } from '@nestjs/apollo';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGqlConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UserModule
  ]
})
export class AppModule { }
