import { Profile } from "src/profiles/profile.entity";
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
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profileId: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ referencedColumnName: 'id' })
  profile: Profile;

  @Column()
  profileIndex: number;

  @Column({ nullable: true })
  name: string

  @Column({ default: '' })
  text: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  prevCount: number;

  @Column({ default: 0 })
  nextCount: number;

  @Column({ default: 0 })
  rootCount: number;

  @Column({ default: 0 })
  leafCount: number;

  @Column({ default: 0 })
  tabCount: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
 
  @DeleteDateColumn()
  deleteDate: Date;
}
