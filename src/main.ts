
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  //  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',');

      if (
        !origin ||
        allowedOrigins?.includes('*') ||
        allowedOrigins?.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('')
      .setDescription('')
      .setVersion('1.0')
      .addTag('')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000;
  await app.listen(port, () => {
    console.log(`Server started on port ${port} 🟢`);
  });
}
bootstrap();
