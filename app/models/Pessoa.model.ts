import { BaseEntity, Column, Entity, JoinColumn,
         ManyToMany, OneToMany, OneToOne,
         PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario.model';

@Entity('pessoa')
export class Pessoa extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public nome: string;

  @OneToOne(() => Usuario, (usuario) => usuario.pessoa)
  @JoinColumn()
  public usuario: Usuario;

}
