import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", {length: 200})
  nama: string

  @Column("varchar", {length: 50, unique: true})
  username: string

  @Column("varchar", {length: 200, unique: true})
  email: string

  @Column("varchar", {length: 200})
  password: string
}