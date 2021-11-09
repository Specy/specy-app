import { Body, Controller, Get, Post, UseGuards , Logger, Param, Patch, UnauthorizedException} from '@nestjs/common'
import { SuccessfulResponse } from 'src/shared/Responses'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtEditGuard } from './guards/jwt-edit.guard'
import { UserService } from './user.service'
import { UserResourcesDto } from './dtos/user-resources.dto'
@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(readonly userService:UserService) { }

	@Patch(':id')
	@ApiOperation({
		summary: 'Update user resources',
	})
	@ApiBearerAuth()
	@UseGuards(JwtEditGuard)
	async updateUser(@Body() data:UserResourcesDto, @Param('id') id:string) {
        await this.userService.updateUser({id},data)
        return new SuccessfulResponse("Resource successfully edited")
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
