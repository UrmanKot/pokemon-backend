import {UserType} from '../../user/types/user.type';
import {Tokens} from './token.interface';

export interface UserResponseLoginInterface {
  user: UserType,
  tokens: Tokens,
}
