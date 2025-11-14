import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FolderEntity } from "../../entities/folder.entity";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { ClsService } from "nestjs-cls";

@Injectable()
export class FolderService {
	constructor(
		@InjectRepository(FolderEntity)
		private folderRepo: Repository<FolderEntity>,
		private cls: ClsService
	) { }

	async create(ownerId: number, dto: CreateFolderDto) {
		const folder = this.folderRepo.create({ ...dto, ownerId })
		return await this.folderRepo.save(folder)
	}

	async listAll() {
		return await this.folderRepo.find({ order: { createdAt: 'DESC' } })
	}

	async listByOwner(ownerId: number) {
		return await this.folderRepo.find({ where: { ownerId }, order: { createdAt: 'DESC' } })
	}

	async deleteFolder(id: number) {
		let user = this.cls.get('user')

		let folder = await this.folderRepo.findOne({ where: { id } })

		if (!folder) throw new NotFoundException('Qovluq tapılmadı!')

		if (user.role != 'admin') {
			if (user.id != folder.ownerId) throw new UnauthorizedException('Qovluğu silmək üçün icazəniz yoxdur!')
		}

		await this.folderRepo.delete({ id })

		return { message: "Qovluq uğurla silindi" }
	}
}

