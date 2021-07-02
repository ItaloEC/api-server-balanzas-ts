import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Scale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: "online" | "offline";
}
