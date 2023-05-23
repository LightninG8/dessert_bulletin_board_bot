import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

const sessions = new LocalSession({ database: 'session_db.json' });
@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.BOT_TOKEN,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          colors: true,
          prettyPrint: true,
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(__dirname, './../log/'), //path to where save loggin result
          filename: 'log.log', //name of file where will be saved logging result
        }),
      ],
    }),
    UsersModule,
    AnnouncementsModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [AppUpdate, AppService],
})
export class AppModule {}
