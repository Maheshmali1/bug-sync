import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService, UserService } from './services';
import { BlackListToken, blackListTokenSchema, User, userSchema } from './entities';
import { RouteLoggerMiddleware } from './middlewares';
import { AuthController, UserController } from './controllers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature(
      [{ name: User.name, schema: userSchema },
      { name: BlackListToken.name, schema: blackListTokenSchema }
      ]
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('AUTH_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UserController,AuthController],
  providers: [UserService,AuthService],
})
  export class BugSyncModule {
  configure(consumer: MiddlewareConsumer): void{
    consumer.apply(RouteLoggerMiddleware).forRoutes('/')
  }
}
