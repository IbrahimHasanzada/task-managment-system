import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TaskListService } from "./tasklist.service";
import { CreateTaskListDto } from "./dto/create-tasklist.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Auth } from "../../shared/decorators/auth.decorator";

@ApiTags('task-list')
@Controller('task-list')
export class TaskListController {
	constructor(private taskListService: TaskListService) { }

	@Get('folder/:folderId')
	async listByFolder(@Param('folderId') folderId: number) {
		return await this.taskListService.listByFolder(Number(folderId))
	}

	@Post()
	@Auth()
	async create(@Body() body: CreateTaskListDto) {
		return await this.taskListService.create(body)
	}

	@Delete(':id')
	async deleteTaskList(@Param("id") id: number) {
		return await this.taskListService.deleteTaskList(id)
	}
}

