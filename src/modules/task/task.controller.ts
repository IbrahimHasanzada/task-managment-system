import { Body, Controller, Get, Param, Post, Put, ParseIntPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Auth } from "../../shared/decorators/auth.decorator";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ReorderTaskDto } from "./dto/reorder-task.dto";

@Controller('task')
export class TaskController {
	constructor(private taskService: TaskService) { }

	@Get('list/:taskListId')
	async listByTaskList(@Param('taskListId') taskListId: number) {
		return await this.taskService.listByTaskList(Number(taskListId))
	}

	@Post()
	@Auth()
	async create(@Body() body: CreateTaskDto) {
		return await this.taskService.create(body)
	}

	@Post(':id')
	@Auth()
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
		return await this.taskService.update(id, body)
	}

	@Post('reorder')
	@Auth()
	async reorder(@Body() body: ReorderTaskDto) {
		return await this.taskService.reorder(body)
	}
}

