import { BaseEntity, Column, Entity, OneToOne,
         PrimaryGeneratedColumn } from 'typeorm';
import { Pessoa } from './Pessoa.model';

@Entity('usuario')
export class Usuario extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text', { unique : true })
  public email: string;

  @Column('text')
  public senha: string;

  @OneToOne(() => Pessoa, (pessoa) => pessoa.usuario)
  public pessoa: Pessoa;
}
