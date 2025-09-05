import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { AuthService } from './auth.service';

import { AuthModel } from './models/auth.model';
import type { RegisterInput } from './inputs/register.input';
import type { LoginInput } from './inputs/login.input';
import type { GqlContext } from 'src/common/interfaces/gql-context.interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthModel)
  async register(
    @Context() { res }: GqlContext,
    @Args('data') input: RegisterInput
  ) {
    return await this.authService.register(res, input)
  }

  @Mutation(() => AuthModel)
  async login(
    @Context() { res }: GqlContext,
    @Args('data') input: LoginInput
  ) {
    return await this.authService.login(res, input)
  }

  @Mutation(() => AuthModel)
  async refresh(@Context() { req, res }: GqlContext) {
    return await this.authService.refresh(req, res)
  }

  @Mutation(() => Boolean)
  async logout(@Context() { res }: GqlContext) {
    return await this.authService.logout(res)
  }
}
