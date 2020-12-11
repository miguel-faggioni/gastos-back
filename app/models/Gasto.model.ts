import { BaseEntity, Column, Entity,
         ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Data } from './Data.model';
import { Categoria } from './Categoria.model';
import { ModoDePagamento } from './Modo_de_pagamento.model';
import { Pessoa } from './Pessoa.model';

@Entity('gasto')
export class Gasto extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('decimal', {precision: 13, scale: 2})
  public valor: number;

  @ManyToOne(() => Data, data => data.gastos, { nullable: false })
  public data: Data;

  @ManyToOne(() => Categoria, categoria => categoria.gastos, { nullable: false })
  public categoria: Categoria;

  @ManyToOne(() => ModoDePagamento, mdp => mdp.gastos, { nullable: false })
  public modo_de_pagamento: ModoDePagamento;

  @ManyToOne(() => Pessoa, pessoa => pessoa.gastos, { nullable: false })
  public pessoa: Pessoa;

}
