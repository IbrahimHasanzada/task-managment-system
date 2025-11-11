import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskListEntity } from "../../entities/tasklist.entity";
import { CreateTaskListDto } from "./dto/create-tasklist.dto";

@Injectable()
export class TaskListService {
	constructor(
		@InjectRepository(TaskListEntity)
		private taskListRepo: Repository<TaskListEntity>
	) { }

	async create(dto: CreateTaskListDto) {
		const list = this.taskListRepo.create(dto)
		return await this.taskListRepo.save(list)
	}

	async listByFolder(folderId: number) {
		return await this.taskListRepo.find({ where: { folderId }, order: { createdAt: 'DESC' } })
	}
}

