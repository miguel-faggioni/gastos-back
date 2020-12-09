import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aviso_geral')
export class AvisoGeral extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public titulo: string;

  @Column('text')
  public conteudo: string;

}
