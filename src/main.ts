import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		snapshot: true
	});

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: false,
		transform: true,
		transformOptions: {
			enableImplicitConversion: true,
			excludeExtraneousValues: true,
		},
		disableErrorMessages: false,
		stopAtFirstError: false,
		exceptionFactory: (errors) => {
			const messages = errors.map(error => {
				const constraints = error.constraints;
				if (constraints) {
					return Object.values(constraints).join(', ');
				}
				return `${error.property} has invalid value`;
			});
			return new BadRequestException(messages);
		},
	}),);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cookieParser());

	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3001',
		credentials: true,
		methods: 'GET, PUT, POST, DELETE, PATCH',
		allowedHeaders: 'Content-Type, Authorization',
	});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
