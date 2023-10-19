import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attachment } from './attachment.entity';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Category, (category) => category.news, { eager: true })
  @JoinTable()
  categories: Category[];

  @Column()
  subject: string;

  @Column('longtext')
  content: string;

  @Column({ nullable: true })
  scheduled?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('simple-array', { default: '' })
  extraRecipients: string[];

  @OneToMany(() => Attachment, (attachment) => attachment.news, {
    cascade: true,
    eager: true,
  })
  attachments: Attachment[];
}
