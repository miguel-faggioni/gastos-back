import { BaseEntity, Column, CreateDateColumn,
         Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('jobs_to_run')
export class JobsToRun extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public criado_em: Date;

  @Column('smallint')
  public dia_do_mes_pra_rodar: number;

  @Column('text')
  public tabela: string;

  @Column('integer')
  public id_da_entidade: number;

  @Column('text')
  public sql: string;

}
