import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from '../dto/create-news.dto';
import { News } from '../entities/news.entity';
import {
  And,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { fromExpressFiles } from '../entities/attachment.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto) {
    return await this.newsRepository.save({
      ...createNewsDto,
      attachments: fromExpressFiles(createNewsDto.files || []),
      categories: createNewsDto.categories?.map((c) => ({ name: c })) ?? [],
    });
  }

  async findAllPublished() {
    return this.newsRepository.find({
      where: [
        { scheduled: LessThanOrEqual(new Date()) },
        { scheduled: IsNull() },
      ],
      relations: { categories: true },
    });
  }

  async findAllScheduled() {
    return this.newsRepository.find({
      where: { scheduled: MoreThanOrEqual(new Date()) },
      relations: { categories: true },
    });
  }

  async findScheduledFrom(fromDate: Date) {
    return this.newsRepository.find({
      where: {
        scheduled: And(MoreThan(fromDate), LessThanOrEqual(new Date())),
      },
      relations: { categories: true },
    });
  }

  async findOne(id: number) {
    return this.newsRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
  }

  async remove(id: number) {
    return this.newsRepository.delete(id);
  }
}
