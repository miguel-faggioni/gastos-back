import { BaseEntity, Column, CreateDateColumn,
         Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job')
export class JobsToRun extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text', { unique: true })
  public name: string;

  @Column('text')
  public sql: string;

  @Column('timestamptz')
  public run_at: Date;

  @Column('text')
  public interval: string;

  @Column('boolean', { default: true })
  public active: boolean;

}
