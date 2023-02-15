import { Post } from "src/posts/post.entity";
import { Profile } from "src/profiles/profile.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profileId: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ referencedColumnName: 'id' })
  profile: Profile;

  @Column()
  postId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ referencedColumnName: 'id' })
  post: Post;

  @Column({ default: 0 })
  value: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}