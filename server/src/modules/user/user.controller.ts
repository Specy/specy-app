import { Body, Controller, Get, Post, UseGuards , Logger, Param, Patch, UnauthorizedException, Delete} from '@nestjs/common'
import { SuccessfulResponse } from 'src/shared/Responses'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtEditGuard } from './guards/jwt-edit.guard'
import { UserService } from './user.service'
import { UserResourcesDto } from './dtos/user-resources.dto'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../auth/decorators/user.decorator'
import { User as UserEntity } from '@prisma/client'
import { TokenDeletionDto } from './dtos/token-deletion.dto'
@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(readonly userService:UserService) { }

	@Patch(':id')
	@ApiOperation({
		summary: 'Update user resources'
	})
	@ApiBearerAuth()
	@UseGuards(JwtEditGuard)
	async updateUser(@Body() data:UserResourcesDto, @Param('id') id:string) {
        await this.userService.updateUser({id},data)
        return new SuccessfulResponse("Resource successfully edited")
	}
	@Delete('tokens')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: 'Manually deletes a token for an user'
	})
	async deleteToken(@User() user:UserEntity, @Body() data:TokenDeletionDto){
		const token = await this.userService.getToken({id: data.id})
		await this.userService.deleteToken(token.token)
		if(token.userId !== user.id) throw new UnauthorizedException("User cannot delete this token")
		return new SuccessfulResponse("Token deleted")
	}
	@Get('tokens')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: 'Gets list of tokens related to this user'
	})
	async getTokens(@User() user:UserEntity){
		let tokens = await this.userService.getTokensByUserId(user.id)
		return tokens.map(token => {return {
			id: token.id,
			createdAt: token.createdAt
		}})
	}
	@Get(':id')
	@ApiOperation({
		summary: 'Gets data regarding an user',
	})
	async getUser(@Param("id") id){
		const data = await this.userService.get(id,{
			username:true,
			picture:true,
			id: true
		})
		return data
	}
}
