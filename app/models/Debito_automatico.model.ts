import { BaseEntity, Column, Entity,
         ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Categoria } from './Categoria.model';
import { ModoDePagamento } from './Modo_de_pagamento.model';
import { Pessoa } from './Pessoa.model';

@Entity('debito_automatico')
export class DebitoAutomatico extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('smallint')
  public dia_do_mes: number;

  @Column('decimal', {precision: 13, scale: 2})
  public valor: number;

  @ManyToOne(() => Categoria, categoria => categoria.debitos_automaticos, { nullable: false })
  public categoria: Categoria;

  @ManyToOne(() => ModoDePagamento, mdp => mdp.debitos_automaticos, { nullable: false })
  public modo_de_pagamento: ModoDePagamento;

  @ManyToOne(() => Pessoa, pessoa => pessoa.debitos_automaticos, { nullable: false })
  public pessoa: Pessoa;

}
