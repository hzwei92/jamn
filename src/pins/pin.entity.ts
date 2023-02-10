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
export class Pin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rootPostId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'rootPostId', referencedColumnName: 'id' })
  rootPost: Post;

  @Column()
  leafPostId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'leafPostId', referencedColumnName: 'id' })
  leafPost: Post;

  @Column({ default: 0 })
  upvotes: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
 
  @DeleteDateColumn()
  deleteDate: Date;
}
