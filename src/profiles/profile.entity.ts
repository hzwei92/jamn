import { PaletteMode } from "src/enums";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
 
  @DeleteDateColumn()
  deleteDate: Date;
}
