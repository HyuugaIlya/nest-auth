import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class LoginRequest {
    @IsString({ message: 'Почта должна быть строкой' })
    @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
    @IsEmail({}, { message: 'Почта должна быть валидной' })
    email: string

    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
    @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
    @MaxLength(60, { message: 'Пароль должен быть не более 60 символов' })
    password: string
}