import { NestFactory } from '@nestjs/core';
import { BugSyncModule } from './api-bug-sync.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BugSyncModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = configService.get('PORT', 4000);
  await app.listen(port);


  Logger.log(`api-bug-sync started listening on ${port} 🚀`);
}
bootstrap();
