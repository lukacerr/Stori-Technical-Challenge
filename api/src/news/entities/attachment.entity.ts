import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { News } from './news.entity';

@Entity()
export class Attachment {
  @PrimaryColumn()
  path: string;

  @Column()
  filename: string;

  @ManyToOne(() => News, (news) => news.attachments)
  news: News;
}

export function fromExpressFiles(files: Array<Express.Multer.File>) {
  return files.map((f) => ({
    path: f.path,
    filename: f.originalname,
  }));
}
