import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtEditGuard extends AuthGuard('jwt') implements CanActivate{
    canActivate(
        context: ExecutionContext
    ): boolean{
        const request = context.switchToHttp().getRequest()
        const params = request.params
        let id = params.id
        let user = request.user
        console.log(id,user)
        return user.id === id
    }
}