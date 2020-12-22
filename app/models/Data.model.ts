import { BaseEntity, Column, Entity,
         OneToMany,
         PrimaryColumn,
} from 'typeorm';

import { Gasto } from './Gasto.model';

@Entity('data')
export class Data extends BaseEntity {

  @PrimaryColumn('bigint')
  public unix_timestamp: number;

  @Column('smallint')
  public dia: number;

  @Column('smallint')
  public mes: number;

  @Column('smallint')
  public ano: number;

  @Column('smallint')
  public dia_da_semana: number;

  @Column('smallint')
  public semana_do_ano: number;

  @Column('smallint')
  public hora: number;

  @Column('smallint')
  public minuto: number;

  @Column('smallint')
  public segundo: number;

  @OneToMany(() => Gasto, gasto => gasto.data)
  public gastos: Gasto[];


  /**
   * Returns the week number for this date.  dowOffset is the day of week the week
   * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
   * the week returned is the ISO 8601 week number.
   * @param int dowOffset
   * @return int
   */
  // taken from https://stackoverflow.com/questions/9045868/javascript-date-getweek
  public static getWeekOfYear(date: Date, dowOffset?: number) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof(dowOffset) === 'number' ? dowOffset : 0; // default dowOffset to zero
    const newYear = new Date(date.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset; // the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    const daynum = Math.floor(
      (
        date.getTime()
        - newYear.getTime()
        - (
          date.getTimezoneOffset() - newYear.getTimezoneOffset()
        ) * 60000
      ) / 86400000
    ) + 1;
    let weeknum;
    // if the year starts before the middle of a week
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1;
      if (weeknum > 52) {
        const nYear = new Date(date.getFullYear() + 1, 0, 1);
        let nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        /*if the next year starts before the middle of
           the week, it is week #1 of that year*/
        weeknum = nday < 4 ? 1 : 53;
      }
    } else {
      weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
  }

  constructor(iso: string) {
    super();
    if (iso !== undefined) {
      const data = new Date(iso);
      this.unix_timestamp = data.getTime();
      this.dia = data.getDate();
      this.mes = data.getMonth();
      this.ano = data.getFullYear();
      this.dia_da_semana = data.getDay();
      this.semana_do_ano = Data.getWeekOfYear(data);
      this.hora = data.getHours();
      this.minuto = data.getMinutes();
      this.segundo = data.getSeconds();
    }
  }

}
