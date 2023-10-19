import { News } from 'src/news/entities/news.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { DeleteDateColumn, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn({ length: 30 })
  name: string;

  @ManyToMany(() => Subscription, (subscription) => subscription.categories)
  subscriptions: Subscription[];

  @ManyToMany(() => News, (news) => news.categories)
  news: News[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
