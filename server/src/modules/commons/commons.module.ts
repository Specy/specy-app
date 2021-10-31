
import { Module } from '@nestjs/common'
import { PasswordService } from './services/password.service'
import { IdGeneratorService } from './services/id-generator.service'
@Module({
	providers: [PasswordService, IdGeneratorService],
	exports: [PasswordService, IdGeneratorService],
})
export class CommonsModule { }
