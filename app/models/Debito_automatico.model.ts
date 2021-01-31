import { BaseEntity, Column, Entity,
         ManyToOne,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Categoria } from './Categoria.model';
import { ModoDePagamento } from './Modo_de_pagamento.model';
import { Pessoa } from './Pessoa.model';

// I have no fucking idea why importing doesn't work
// but it says it is undefined for some fucking reason
// import { TipoGasto } from './Gasto.model';
enum TipoGasto {
  Fixo = 'Fixo',
  Variavel = 'Variável',
  Renda = 'Renda',
}

@Entity('debito_automatico')
export class DebitoAutomatico extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('smallint')
  public dia_do_mes: number;

  @Column('decimal', {precision: 13, scale: 2})
  public valor: number;

  @Column({
    type: 'enum',
    enum: TipoGasto,
    default: TipoGasto.Variavel,
  })
  public tipo: TipoGasto;

  @Column('text', { default: 'Débito automático' })
  public obs: string;

  @ManyToOne(() => Categoria, categoria => categoria.debitos_automaticos, { nullable: false })
  public categoria: Categoria;

  @ManyToOne(() => ModoDePagamento, mdp => mdp.debitos_automaticos, { nullable: false })
  public modo_de_pagamento: ModoDePagamento;

  @ManyToOne(() => Pessoa, pessoa => pessoa.debitos_automaticos, { nullable: false })
  public pessoa: Pessoa;

}
