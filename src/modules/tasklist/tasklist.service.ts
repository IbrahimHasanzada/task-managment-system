import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskListEntity } from "../../entities/tasklist.entity";
import { CreateTaskListDto } from "./dto/create-tasklist.dto";
import { ClsService } from "nestjs-cls";

@Injectable()
export class TaskListService {
	constructor(
		@InjectRepository(TaskListEntity)
		private taskListRepo: Repository<TaskListEntity>,
		private cls: ClsService
	) { }

	async create(dto: CreateTaskListDto) {
		const list = this.taskListRepo.create(dto)
		return await this.taskListRepo.save(list)
	}

	async listByFolder(folderId: number) {
		return await this.taskListRepo.find({ where: { folderId }, order: { createdAt: 'DESC' } })
	}

	async deleteTaskList(id: number) {
		let user = this.cls.get('user')

		let taskList = await this.taskListRepo.findOne({ where: { id } })

		if (!taskList) throw new NotFoundException('Siyahı tapılmadı')

		if (user.role != 'admin') {
			if (user.id != taskList.folder.ownerId) throw new UnauthorizedException('Siyahını silmək üçün icazəniz yoxdur')
		}

		await this.taskListRepo.delete({ id })

		return { message: "Siyahı uğurla silindi" }
	}
}

