import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from "cookie-parser"
async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: [
			'http://localhost:3000',
			'https://specy.app',
		  ],
		  credentials: true,
	})
	app.useGlobalPipes(new ValidationPipe({whitelist: true}))
	app.use(cookieParser())
	const config = new DocumentBuilder()
		.setTitle('Specy.app Auth API')
		.setDescription(
			'The auth API used internally within Specy.app applications',
		)
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)
	await app.listen(Number(process.env.PORT || 5000))
}
bootstrap()
