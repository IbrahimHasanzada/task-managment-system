import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @Type()
    @IsString()
    @ApiProperty()
    username: string

    @Type()
    @IsNumber()
    @ApiProperty()
    avatarId: number

    @Type()
    @IsString()
    @ApiProperty()
    phone: string

    @Type()
    @IsString()
    @ApiProperty()
    email: string
  
    @Type()
    @IsString()
    @ApiProperty()
    password: string

    @Type()
    @IsNumber()
    @ApiProperty()
    roleId: number
}