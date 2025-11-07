import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class RoleDto {
    @Type()
    @IsString()
    @ApiProperty()
    role: string
}