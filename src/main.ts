import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AUTHORIZATION } from './lib/constant';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Event Planner')
    .setDescription('The Event Planner API description')
    .setVersion('1.0')
    .addTag('Event Planner')
    .addBearerAuth(
      { type: 'apiKey', in: 'header', name: 'Authorization' },
      AUTHORIZATION,
    )
    .addServer('http://localhost:4000/', 'HTTP')
    .addServer('https://www.event-planner.com/', 'HTTPS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
