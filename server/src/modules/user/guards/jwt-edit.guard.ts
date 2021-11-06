import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtService} from '@nestjs/jwt'

@Injectable()
export class JwtEditGuard implements CanActivate{
    constructor(
        private readonly jwtService: JwtService
    ){}
    canActivate(
        context: ExecutionContext
    ): boolean{
        const request = context.switchToHttp().getRequest()
        const params = request.params
        let id = params.id
        let jwt = request.headers.authorization.replace('Bearer ', '')
        jwt = this.jwtService.decode(jwt)
        if(jwt.id !== id) throw new UnauthorizedException("Unhautorized to access this user")
        return jwt.id === id
    }
}