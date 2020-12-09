import { BaseEntity, Column, Entity,
         OneToMany, OneToOne, JoinColumn,
         PrimaryGeneratedColumn,
} from 'typeorm';

import { Gasto } from './Gasto.model';
import { Usuario } from './Usuario.model';
import { ModoDePagamento } from './Modo_de_pagamento.model';
import { Categoria } from './Categoria.model';
import { DebitoAutomatico } from './Debito_automatico.model';

@Entity('pessoa')
export class Pessoa extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public nome: string;

  @OneToOne(() => Usuario, (usuario) => usuario.pessoa)
  @JoinColumn()
  public usuario: Usuario;

  @OneToMany(() => Gasto, gasto => gasto.pessoa)
  public gastos: Gasto[];

  @OneToMany(() => Categoria, categoria => categoria.pessoa)
  public categorias: Categoria[];

  @OneToMany(() => ModoDePagamento, mdp => mdp.pessoa)
  public modos_de_pagamento: ModoDePagamento[];

  @OneToMany(() => DebitoAutomatico, da => da.pessoa)
  public debitos_automaticos: DebitoAutomatico[];

}
