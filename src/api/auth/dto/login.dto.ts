import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class LoginRequest {

    @ApiProperty({
        description: 'Отображаемая почта',
        example: 'example@mail.com',
    })
    @IsString({ message: 'Почта должна быть строкой' })
    @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
    @IsEmail({}, { message: 'Почта должна быть валидной' })
    email: string

    @ApiProperty({
        description: 'Пароль от аккаунта',
        example: '123456',
        maxLength: 60,
        minLength: 6,
    })
    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
    @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
    @MaxLength(60, { message: 'Пароль должен быть не более 60 символов' })
    password: string
}