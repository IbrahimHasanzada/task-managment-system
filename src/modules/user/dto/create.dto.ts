import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class CreateUserDto {
    @Type()
    @IsString()
    @ApiProperty()
    username: string

    @Type()
    @IsString()
    @ApiProperty()
    avatar: string

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
    @IsString()
    @ApiProperty()
    roleId: number
}