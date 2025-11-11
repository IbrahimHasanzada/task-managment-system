import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FolderEntity } from "../../entities/folder.entity";
import { CreateFolderDto } from "./dto/create-folder.dto";

@Injectable()
export class FolderService {
	constructor(
		@InjectRepository(FolderEntity)
		private folderRepo: Repository<FolderEntity>
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
}

