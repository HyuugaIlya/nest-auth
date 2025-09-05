import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User, UserRole } from "@prisma/client";
import { BaseModel } from "src/auth/models/base.model";

registerEnumType(UserRole, {
    name: 'UserRole'
})

@ObjectType({
    description: 'Модель пользователя'
})
export class UserModel extends BaseModel implements User {
    @Field(() => String, {
        description: 'Имя пользователя',
        nullable: true
    })
    name: string

    @Field(() => UserRole, {
        description: 'Роль пользователя'
    })
    role: UserRole

    @Field(() => String, {
        description: 'Почта пользователя'
    })
    email: string

    @Field(() => String, {
        description: 'Пароль пользователя'
    })
    password: string
}