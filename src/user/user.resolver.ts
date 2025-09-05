import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserRole, type User } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Authorization(UserRole.ADMIN)
  @Query(() => [UserModel], {
    name: 'getAllUsers',
    description: 'Получение всех пользователей'
  })
  async getAll() {
    return await this.userService.findAll()
  }

  @Authorization()
  @Query(() => UserModel)
  async me(@Authorized() user: User) {
    return user
  }
}
