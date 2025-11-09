import { Injectable } from '@nestjs/common';
import { UploadImageDto } from './dto/uploads.dto';
import { Repository } from 'typeorm';
import { UploadsEntity } from 'src/entities/uploads.entity';
import { InjectRepository } from '@nestjs/typeorm';
import config from 'src/config';

@Injectable()
export class UplaodsService {
    constructor(
        @InjectRepository(UploadsEntity)
        private imageRepo: Repository<UploadsEntity>
    ) { }


    async saveFile(file: Express.Multer.File) {
        let result = await this.imageRepo.save({
            url: config.url + '/uploads/' + file.filename,
        });


        return result;
    }
}