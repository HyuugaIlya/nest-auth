import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
    return new DocumentBuilder()
        .setTitle('Nest Auth API')
        .setDescription('API Documentation for Nest Auth App')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build()
}