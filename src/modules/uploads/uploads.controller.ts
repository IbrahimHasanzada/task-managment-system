// uploads.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UPLOAD_IMAGE_MAX_SIZE } from 'src/shared/constants/upload.constants';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { imageFileFilter } from 'src/shared/utils/upload-filter.utils';
import { UplaodsService } from './uploads.service';
import { UploadInterceptor } from 'src/shared/interceptors/upload.interceptor';

@Controller('uploads')
export class UploadsController {
    constructor(
        private uploadsService: UplaodsService
    ) { }
    
    @Post('image')
    @Auth()
    @UseInterceptors(UploadInterceptor.getInterceptor())
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                }
            },
        },
    })
    async uploadSingleFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: UPLOAD_IMAGE_MAX_SIZE })],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.uploadsService.saveFile(file);
    }
}