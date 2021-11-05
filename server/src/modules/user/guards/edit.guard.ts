import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class EditGuard implements CanActivate{
    constructor(
       
    ){}
    canActivate(
        context: ExecutionContext
    ): boolean{
        const request = context.switchToHttp().getRequest()
        const params = request.params
        let id = params.id
        if(true) throw new UnauthorizedException("Unhautorized to access this user")
        return true
    }
}