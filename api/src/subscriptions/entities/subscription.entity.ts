import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryColumn({ length: 320 })
  email: string;

  @Column({ length: 120, nullable: true })
  name?: string;

  @ManyToMany(() => Category, (category) => category.subscriptions, {
    eager: true,
  })
  @JoinTable()
  categories: Category[];
}
