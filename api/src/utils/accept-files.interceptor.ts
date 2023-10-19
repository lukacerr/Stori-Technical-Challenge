import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { ApiConsumes } from '@nestjs/swagger';

export const AcceptFiles = ({ field = 'files', maxCount = 1 } = {}) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FilesInterceptor(field, maxCount, {
        storage: diskStorage({
          destination: './public',
          filename: (_, file, cb) =>
            cb(
              null,
              `${randomBytes(12).toString('hex')}${extname(file.originalname)}`,
            ),
        }),
      }),
    ),
  );
