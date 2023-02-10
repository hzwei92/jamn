import { Post } from "src/posts/post.entity";
import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
} from "typeorm";

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prevPostId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'prevPostId', referencedColumnName: 'id' })
  prevPost: Post;

  @Column()
  nextPostId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'nextPostId', referencedColumnName: 'id' })
  nextPost: Post;

  @Column({ default: 0 })
  upvotes: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
 
  @DeleteDateColumn()
  deleteDate: Date;
}
