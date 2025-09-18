import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { AuthResponse } from './dto/auth.dto';
import { Authorization } from './decorators/authorization.decorator';
import { Authorized } from './decorators/authorized.decorator';

import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Создание аккаунта',
    description: 'Создает новый аккаунт пользователя'
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiConflictResponse({ description: 'Пользователь с такой почтой уже существует' })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest
  ) {
    return await this.authService.register(res, dto)
  }

  @ApiOperation({
    summary: 'Вход в систему',
    description: 'Вход в существующий аккаунт пользователя и выдача токена доступа'
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBadRequestResponse({ description: 'Некорректные входные данные' })
  @Post('signup')
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest
  ) {
    return await this.authService.login(res, dto)
  }

  @ApiOperation({
    summary: 'Обновление токена',
    description: 'Обновляет токен доступа для входа в аккаунт'
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Refresh-токен отсутствует' })
  @ApiUnauthorizedResponse({ description: 'Недействительный refresh-токен' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res)
  }

  @Authorization()
  @Get('@me')
  @HttpCode(HttpStatus.OK)
  async me(@Authorized() user: User) {
    return user
  }

  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Выполняет выход из аккаунта пользователя'
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(res)
  }
}
