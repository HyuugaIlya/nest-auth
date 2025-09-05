import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType({
    isAbstract: true,
    description: 'Модель с базовыми полями'
})
export class BaseModel {
    @Field(() => ID, {
        description: 'Поле ID'
    })
    id: string

    @Field(() => Date, {
        description: 'Время создания'
    })
    createdAt: Date

    @Field(() => Date, {
        description: 'Время обновления'
    })
    updatedAt: Date
}