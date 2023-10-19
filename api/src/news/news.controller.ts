import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { NewsService } from './services/news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminOnly } from 'src/auth/admin-only.decorator';
import { MailingService } from './services/mailing.service';
import { AcceptFiles } from 'src/utils/accept-files.interceptor';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly mailingService: MailingService,
  ) {}

  @ApiOperation({ summary: 'Creates a new' })
  @AcceptFiles({ maxCount: 10 })
  @AdminOnly()
  @Post()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    createNewsDto.files = files;
    const news = await this.newsService.create(createNewsDto);
    if (!news.scheduled) await this.mailingService.sendNew(news);
    return news;
  }

  @ApiOperation({ summary: 'Gets all published news' })
  @Get()
  findAll() {
    return this.newsService.findAllPublished();
  }

  @ApiOperation({ summary: 'Gets all scheduled news' })
  @AdminOnly()
  @Get('scheduled')
  findAllScheduled() {
    return this.newsService.findAllScheduled();
  }

  @ApiOperation({ summary: 'Get a detailed new by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Deletes a new by ID' })
  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
