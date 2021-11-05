import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common' 
import { Request } from 'express'
import { UserService } from 'src/modules/user/user.service'
@Injectable()
export class CookieGuard implements CanActivate{
    constructor(
        private readonly userService: UserService
    ){}
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean>{
        const request:Request = context.switchToHttp().getRequest()
        const params = request.params
        const session = request.cookies.session_id
        let user = await this.userService.getSession(session)
        return Boolean(user)
    }
}