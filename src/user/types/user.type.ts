import {UserEntity} from '../entities/user.entity';

export type UserType = Omit<UserEntity, 'hashPassword' | 'activationLink' | 'password' | 'updateTimestamp' | 'generateId'>
