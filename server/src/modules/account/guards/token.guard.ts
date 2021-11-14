import { Injectable,CanActivate,ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TokenService} from '../services/token.service'
@Injectable()
export class TokenGuard implements CanActivate{
    constructor(
        private readonly tokenService: TokenService
    ){}
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const params = request.params
        const token = params.token
        const email = request.body.email
        const isAuthorised = await this.tokenService.verifyToken({email,token})
        if(!isAuthorised) throw new UnauthorizedException("Token is wrong")
        return isAuthorised
    }
}
