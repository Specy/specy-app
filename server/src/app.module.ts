import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaModule } from 'nestjs-prisma'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from './modules/account/account.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
	imports: [
		AccountModule,
		AuthModule,
		PrismaModule.forRoot({
			isGlobal: true,
		}),
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule { }
