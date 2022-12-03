import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from '../user/entities/user.entity';
import {MailService} from '../shared/services/mail.service';
import {TokenService} from './services/token.service';
import {AuthGuard} from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [AuthService, TokenService],
  controllers: [AuthController],
  providers: [AuthService, MailService, TokenService, AuthGuard]
})
export class AuthModule {
}
