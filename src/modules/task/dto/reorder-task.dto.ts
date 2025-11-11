import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class ReorderTaskDto {
	@Type(() => Number)
	@IsNumber()
	@ApiProperty()
	taskId: number

	@Type(() => Number)
	@IsNumber()
	@ApiProperty()
	targetIndex: number
}

