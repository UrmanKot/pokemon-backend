import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {ExpressRequestInterface} from '../../shared/types/express-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>()

    if (request.user) {
      return true
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
  }
}
