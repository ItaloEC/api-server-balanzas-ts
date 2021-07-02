import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Registry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scaleName: string;

  @Column()
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userName: string;
}
