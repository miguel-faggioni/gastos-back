import { BaseEntity, Column, Entity,
         OneToMany, ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Gasto } from './Gasto.model';
import { Pessoa } from './Pessoa.model';
import { DebitoAutomatico } from './Debito_automatico.model';

@Entity('categoria')
export class Categoria extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public nome: string;

  @Column('text')
  public sigla: string;

  @Column('text')
  public icone: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.categorias, { nullable: false })
  public pessoa: Pessoa;

  @OneToMany(() => Gasto, gasto => gasto.categoria)
  public gastos: Gasto[];

  @OneToMany(() => DebitoAutomatico, da => da.categoria)
  public debitos_automaticos: DebitoAutomatico[];

}
