import {Injectable} from '@nestjs/common';
import {UserEntity} from '../../user/entities/user.entity';
import {sign, verify} from 'jsonwebtoken';
import {Tokens} from '../types/token.interface';
import {EncryptedUserInterface} from '../types/encrypted-user.interface';

@Injectable()
export class TokenService {
  generateTokens(user: UserEntity): Tokens {
    const payload: EncryptedUserInterface = {id: user.id, idNumber: user.idNumber, email: user.email, role: user.role};

    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    };
  }

  validateAccessToken(token: string): EncryptedUserInterface {
    try {
      return <EncryptedUserInterface>verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }
}
