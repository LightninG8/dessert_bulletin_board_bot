import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './database/users/users.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/databaseConfig';
import { AnnouncementsModule } from './database/announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { BotModule } from './bot/bot.module';
import { InjectBot, TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middleware';
import { BOT_NAME } from './commonConstants';
import { GeocoderModule } from './geocoder/geocoder.module';
import { session } from 'telegraf-session-mongodb';
// import * as LocalSession from 'telegraf-session-local';
import { Context, Telegraf } from 'telegraf';
import { Connection } from 'mongoose';
import * as mediaGroup from 'telegraf-media-group';
import { CountersModule } from './database';

// const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),

    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        middlewares: [sessionMiddleware],
        token: process.env.BOT_TOKEN,
        include: [BotModule],
      }),
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
    BotModule,
    GeocoderModule,
    CountersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
    @InjectConnection() private connection: Connection,
  ) {
    this.bot.use(session(this.connection.db, { collectionName: 'sessions' }));
    this.bot.use(mediaGroup());
  }
}
