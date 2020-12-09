import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feedback')
export class Feedback extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public quando: Date;

  @Column('text')
  public texto: string;

}
