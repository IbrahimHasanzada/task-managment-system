import { Body, Controller, Get, Post } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "../../shared/decorators/auth.decorator";
import { ClsService } from "nestjs-cls";

@ApiTags('folder')
@Controller('folder')
export class FolderController {
	constructor(
		private folderService: FolderService,
		private cls: ClsService
	) { }

	@Get()
	async listAll() {
		return await this.folderService.listAll()
	}

	@Post()
	@Auth()
	async create(@Body() body: CreateFolderDto) {
		const user = this.cls.get('user')
		return await this.folderService.create(user.id, body)
	}

	@Get('me')
	@Auth()
	async myFolders() {
		const user = this.cls.get('user')
		return await this.folderService.listByOwner(user.id)
	}
}

