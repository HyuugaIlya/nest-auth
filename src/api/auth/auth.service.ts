import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { PrismaService } from 'src/infra/prisma/prisma.service';

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterRequest, LoginRequest } from './dto';

import { isDev } from 'src/common/utils';
import { JWTPayload } from 'src/common/interfaces';

@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TTL: string
    private readonly JWT_REFRESH_TOKEN_TTL: string

    private readonly COOKIE_DOMAIN: string

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        [
            'JWT_ACCESS_TOKEN_TTL',
            'JWT_REFRESH_TOKEN_TTL',
            'COOKIE_DOMAIN'
        ].map((e) => this[e] = configService.getOrThrow<string>(e))
    }

    async register(res: Response, dto: RegisterRequest) {
        const { name, email, password } = dto

        const existingUser = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        })

        if (existingUser) {
            throw new ConflictException('Пользователь с такой почтой уже существует')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await this.prismaService.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        })

        return this.auth(res, user.id)
    }

    async login(res: Response, dto: LoginRequest) {
        const { email, password } = dto

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                password: true,
            }
        })
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        const isPass = await bcrypt.compare(password, user.password)
        if (!isPass) {
            throw new NotFoundException('Пользователь не найден')
        }

        return this.auth(res, user.id)
    }

    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies['refreshToken']

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh-токен отсутствует')
        }

        const payload: JWTPayload = await this.jwtService.verifyAsync(refreshToken)

        if (!payload) {
            throw new UnauthorizedException('Недействительный refresh-токен')
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.id
            },
            select: {
                id: true
            }
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        return this.auth(res, user.id)
    }

    async logout(res: Response) {
        res.clearCookie('refreshToken', { httpOnly: true })

        return true
    }

    async validate(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        return user
    }

    private generateTokes(id: string) {
        const payload: JWTPayload = { id }

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL
        })

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL
        })

        return {
            accessToken,
            refreshToken
        }
    }

    private setRefreshTokenCookie(res: Response, value: string, expires: Date) {
        res.cookie('refreshToken', value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
            secure: !isDev(this.configService),
            sameSite: isDev(this.configService) ? 'none' : 'lax',
        })
    }

    private auth(res: Response, id: string) {
        const { accessToken, refreshToken } = this.generateTokes(id)

        this.setRefreshTokenCookie(res, refreshToken, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

        return {
            accessToken
        }
    }
}
