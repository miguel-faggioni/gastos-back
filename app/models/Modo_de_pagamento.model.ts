import { BaseEntity, Column, Entity,
         OneToMany, ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Gasto } from './Gasto.model';
import { Pessoa } from './Pessoa.model';
import { DebitoAutomatico } from './Debito_automatico.model';

@Entity('modo_de_pagamento')
export class ModoDePagamento extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public nome: string;

  @Column('text')
  public sigla: string;

  @Column('text')
  public icone: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.modos_de_pagamento, { nullable: false })
  public pessoa: Pessoa;

  @OneToMany(() => Gasto, gasto => gasto.modo_de_pagamento)
  public gastos: Gasto[];

  @OneToMany(() => DebitoAutomatico, da => da.modo_de_pagamento)
  public debitos_automaticos: DebitoAutomatico[];

}
