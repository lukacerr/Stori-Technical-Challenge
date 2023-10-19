import { Module } from '@nestjs/common';
import { NewsService } from './services/news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { MailingService } from './services/mailing.service';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment, News]), SubscriptionsModule],
  controllers: [NewsController],
  providers: [NewsService, MailingService],
})
export class NewsModule {}
