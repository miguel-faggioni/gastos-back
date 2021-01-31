import { BaseEntity, Column, Entity,
         ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Data } from './Data.model';
import { Categoria } from './Categoria.model';
import { ModoDePagamento } from './Modo_de_pagamento.model';
import { Pessoa } from './Pessoa.model';

export enum TipoGasto {
  Fixo = 'Fixo',
  Variavel = 'Variável',
  Renda = 'Renda',
}

@Entity('gasto')
export class Gasto extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('decimal', {precision: 13, scale: 2})
  public valor: number;

  @Column({
    type: 'enum',
    enum: TipoGasto,
    default: TipoGasto.Variavel,
  })
  public tipo: TipoGasto;

  @Column('text', { default: '' })
  public obs: string;

  @ManyToOne(() => Data, data => data.gastos, { nullable: false })
  public data: Data;

  @ManyToOne(() => Categoria, categoria => categoria.gastos, { nullable: false })
  public categoria: Categoria;

  @ManyToOne(() => ModoDePagamento, mdp => mdp.gastos, { nullable: false })
  public modo_de_pagamento: ModoDePagamento;

  @ManyToOne(() => Pessoa, pessoa => pessoa.gastos, { nullable: false })
  public pessoa: Pessoa;

}
