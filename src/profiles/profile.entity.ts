import { PaletteMode } from "src/enums";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/post.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  indexPostId: string;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ referencedColumnName: 'id' })
  indexPost: Post;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  @Index({ unique: true })
  email: string

  @Column()
  color: string;

  @Column({ default: '' })
  text: string;

  @Column({
    type: 'enum',
    enum: PaletteMode,
    default: PaletteMode.LIGHT,
  })
  palette: PaletteMode;

  @Column('double precision', { default: 0 })
  balance: number;

  @Exclude()
  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ default: 0 })
  postCount: number;

  @Column({ default: 0 })
  tabCount: number;

  @Column({ default: 0 })
  leaderCount: number;

  @Column({ default: 0 })
  followerCount: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
 
  @DeleteDateColumn()
  deleteDate: Date;
}
