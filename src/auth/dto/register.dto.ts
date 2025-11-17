import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterRequest {
    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
    @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
    name: string

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