import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {hash} from 'bcrypt';
import {RoleEnum} from '../../auth/enums/role.enum';

@Entity({name: 'users'})
export class UserEntity {

  @PrimaryGeneratedColumn()
  readonly idNumber: number;

  @Column({default: ''})
  id: string;

  @Column()
  email: string;

  @Column({default: ''})
  firstName: string;

  @Column({default: ''})
  lastName: string;

  @Column({default: false})
  isActivated: boolean;

  @Column({default: '', select: false})
  activationLink: string;

  @Column({default: ''})
  image: string;

  @Column({select: false})
  password: string;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @Column({default: RoleEnum.USER})
  role: RoleEnum;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @BeforeInsert()
  generateId() {
    this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
