import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import EnvConfig from './configuration/env.config';
import TypeormConfig from './configuration/typeorm.config';
import MailerConfig from './configuration/mailer.config';
import ScheduleConfig from './configuration/schedule.config';
import StaticConfig from './configuration/static.config';

@Module({
  imports: [
    EnvConfig(),
    TypeormConfig(),
    MailerConfig(),
    ScheduleConfig(),
    StaticConfig(),
    CategoriesModule,
    SubscriptionsModule,
    NewsModule,
    AuthModule,
  ],
})
export class AppModule {}
