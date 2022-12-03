import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserResponseLoginInterface} from './types/user-response-login.interface';
import {v4} from 'uuid';
import {compare} from 'bcrypt';
import {MailService} from '../shared/services/mail.service';
import {TokenService} from './services/token.service';
import {LoginUserDto} from './dto/login-user.dto';
import {UserType} from '../user/types/user.type';
import {UserEntity} from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      private readonly mailService: MailService,
      private readonly tokenService: TokenService,
  ) {
  }

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const candidate = await this.userRepository.findOne({email: createUserDto.email});

    if (candidate) {
      throw new HttpException(`Пользователь с почтовым адресом ${createUserDto.email} уже зарегистрирован`, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const activationLink: string = v4();

    const newUser = new UserEntity();
    newUser.activationLink = activationLink;
    Object.assign(newUser, createUserDto);

    await this.mailService.sendActivationMail(newUser.email, `${process.env.API_HOST}${process.env.API_PORT}/api/auth/activate/${activationLink}`);
    return await this.userRepository.save(newUser);
  }

  async activate(activationLink: string) {
    const user = await this.userRepository.findOne({activationLink});

    if (!user) {
      throw new HttpException(`Неккоректная ссылка активации`, HttpStatus.BAD_REQUEST);
    }

    user.isActivated = true;
    await this.userRepository.save(user);
  }

  buildUserResponseForLogin(user: UserEntity): UserResponseLoginInterface {
    return {
      tokens: this.tokenService.generateTokens(user),
      user: {
        ...user,
      }
    };
  }

  buildUserResponse(user: UserEntity): UserType {
    return {...user};
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({email: loginUserDto.email}, {
      select: ['id', 'idNumber', 'email', 'firstName', 'lastName', 'image', 'password', 'isActivated', 'createdAt', 'updatedAt', 'role']
    });

    if (!user) {
      throw new HttpException('Пользователь с таким email не найден', HttpStatus.BAD_REQUEST);
    }

    const isPassEquals = await compare(loginUserDto.password, user.password);

    if (!isPassEquals) {
      throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
    }

    if (!user.isActivated) {
      throw new HttpException('Аккаунт не активирован. Перейдите по ссылке для активации, чтобы активировать аккаунт', HttpStatus.BAD_REQUEST);
    }

    delete user.password;
    return user;
  }

  async getMe(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }
}
