import { Body, Controller, Get, Post, UseGuards , Logger, Param, Patch, UnauthorizedException} from '@nestjs/common'
import { SuccessfulResponse } from 'src/shared/Responses'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtEditGuard } from './guards/jwt.guard'
import { UserService } from './user.service'
import { UserResourcesDto } from './dtos/user-resources.dto'
@Controller('users')
@ApiTags('Authentication')
export class UserController {
	constructor(readonly userService:UserService) { }

	@Patch(':id')
	@ApiOperation({
		summary: 'Update user resource',
	})
	@ApiBearerAuth()
	@UseGuards(JwtEditGuard)
	async updateUser(@Body() data:UserResourcesDto, @Param('id') id:string) {
        //#TODO implement JWT guard, whitelist elements only present in DTO 
        throw new UnauthorizedException("Whitelist only things inside of the DTO")
        await this.userService.updateUser({id},data)
        return new SuccessfulResponse("Resource successfully edited")
	}
}
