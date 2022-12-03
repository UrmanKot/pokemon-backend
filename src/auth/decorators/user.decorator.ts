import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {ExpressRequestInterface} from '../../shared/types/express-request.interface';

export const EncUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();

  if (!request) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
