import { Controller } from 'camesine';
import * as express from 'express';
import * as csv_stringify from 'csv-stringify';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { log } from '../../config/Logger';
import { Gasto, TipoGasto } from '../models/Gasto.model';
import { Data } from '../models/Data.model';
import { Categoria } from '../models/Categoria.model';
import { ModoDePagamento } from '../models/Modo_de_pagamento.model';
import { CategoriaService } from '../services/Categoria.service';
import { AuthService } from '../services/Auth.service';
import { PessoaService } from '../services/Pessoa.service';
import { GastoService } from '../services/Gasto.service';
import { DebitoAutomaticoService } from '../services/Debito_automatico.service';
import { DataService } from '../services/Data.service';
import { XlsxService } from '../services/Xlsx.service';

export class GastoController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async all(): Promise<express.Response> {
    let token, list;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      list = await GastoService.findManyBy({
        pessoa: {id: token.id},
      }, {
        relations: ['categoria', 'modo_de_pagamento', 'data'],
        order: {
          'data.unix_timestamp': 'DESC', // latest first
        }
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }
    return this.res.status(200).send(list);
  }

  public async find(): Promise<express.Response> {
    const idGasto = this.req.params.id;
    let token, gasto;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      gasto = await GastoService.findOneBy({
        id: idGasto,
        pessoa: {id: token.id},
      }, {
        relations: ['categoria', 'modo_de_pagamento', 'data'],
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }
    return this.res.status(200).send(gasto);
  }

  public async download() {
    // TODO: permitir escolher se quer 1 worksheet por ano/mes/tudo junto
    const {format} = this.req.params;
    const {startDate, endDate} = this.res.locals as {startDate: Date, endDate: Date};

    let token;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    let where = {
      pessoa: {id: token.id},
    };

    if (startDate !== undefined && endDate !== undefined) {
      where = Object.assign({
        data: {
          unix_timestamp: Between(startDate.getTime(), endDate.getTime()),
        },
      }, where);
    } else {
      if (startDate !== undefined) {
        where = Object.assign({
          data: {
            unix_timestamp: MoreThanOrEqual(startDate.getTime()),
          },
        }, where);
      }

      if (endDate !== undefined) {
        where = Object.assign({
          data: {
            unix_timestamp: LessThanOrEqual(startDate.getTime()),
          },
        }, where);
      }
    }

    let gastos;
    try {
      gastos = await GastoService.findManyBy(where, {
        relations: ['categoria', 'modo_de_pagamento', 'data'],
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    function formatData(data: Data) {
      return `${data.dia}/${('0' + (data.mes + 1)).slice(-2)}/${data.ano} - ${data.hora}h${('0' + data.minuto).slice(-2)}`;
    }

    switch (format) {
      case 'csv':
        // create stream
        const Stream = require('stream');
        const csvStream = new Stream.Transform({objectMode: true});

        // add values to stream
        gastos.forEach((gasto) => {
          csvStream.push({
            'valor': gasto.valor,
            'categoria': gasto.categoria.nome,
            'modo de pagamento': gasto.modo_de_pagamento.nome,
            'data': formatData(gasto.data),
            'tipo': gasto.tipo,
            'observações': gasto.obs,
          });
        });

        // finish stream
        csvStream.push(null);

        // convert to csv and return
        return csvStream
          .pipe(csv_stringify({
            header: true
          }))
          .pipe(this.res);

        break;
      case 'xlsx':
        const excel = new XlsxService();

        // add 1st worksheet with Gastos
        excel.addWorksheet(
          'Gastos',
          [
            // { name: 'id', value: (gasto: Gasto) => gasto.id, },
            { name: 'valor', value: (gasto: Gasto) => gasto.valor, },
            // { name: 'categoria.sigla', value: (gasto: Gasto) => gasto.categoria.sigla, },
            { name: 'categoria', value: (gasto: Gasto) => gasto.categoria.nome, },
            // { name: 'modo de pagamento.sigla', value: (gasto: Gasto) => gasto.modo_de_pagamento.sigla },
            { name: 'modo de pagamento', value: (gasto: Gasto) => gasto.modo_de_pagamento.nome },
            { name: 'data', value: (gasto: Gasto) => formatData(gasto.data) },
            { name: 'tipo', value: (gasto: Gasto) => gasto.tipo },
            { name: 'observações', value: (gasto: Gasto) => gasto.obs },
          ],
          gastos
        );

        // return the excel file
        return excel.write('Gastos.xlsx', this.res);

        break;
      default:
        const allowedFormats = ['csv', 'xlsx'];
        return this.res.status(400).send(`Format "${format}" not allowed. Allowed formats: ${allowedFormats}`);
        break;
    }

  }

  public async removeAll(): Promise<express.Response> {
    let token, gastos;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      gastos = await GastoService.removeMany(token.id);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

  public async remove(): Promise<express.Response> {
    const gasto = this.res.locals.gasto;

    try {
      await GastoService.remove(gasto);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

  public async create(): Promise<express.Response> {
    const { data, valor, tipo, obs } = this.req.body as { data: string, valor: number, tipo: TipoGasto, obs: string };
    const { categoria, modo_de_pagamento } = this.res.locals as { categoria: Categoria, modo_de_pagamento: ModoDePagamento };

    let token, pessoa;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      pessoa = await PessoaService.findOneBy({
        id: token.id,
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    let new_data = new Data(data);
    try {
      const existing_data = await DataService.findOneBy(new_data);
      if (existing_data === undefined) {
        new_data = await DataService.save(new_data);
      }
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    const gasto = new Gasto();
    gasto.valor = valor;
    gasto.categoria = categoria;
    gasto.modo_de_pagamento = modo_de_pagamento;
    gasto.data = new_data;
    gasto.pessoa = pessoa;
    gasto.tipo = tipo;
    gasto.obs = obs;

    try {
      await GastoService.save(gasto);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(200).send(gasto);
  }

  public async update(): Promise<express.Response> {
    const { data, valor, tipo, obs } = this.req.body as { data: string, valor: number, tipo: TipoGasto, obs: string };
    const { gasto, categoria, modo_de_pagamento } = this.res.locals as { gasto: Gasto, categoria: Categoria, modo_de_pagamento: ModoDePagamento };

    if ( data !== undefined ) {
      let new_data = new Data(data);
      try {
        const existing_data = await DataService.findOneBy(new_data);
        if (existing_data === undefined) {
          new_data = await DataService.save(new_data);
        }
      } catch (ex) {
        log.error(ex);
        return this.res.status(500).send();
      }
      gasto.data = new_data;
    }

    if ( valor !== undefined ) { gasto.valor = valor; }
    if ( categoria !== undefined ) {gasto.categoria = categoria; }
    if (modo_de_pagamento !== undefined) {gasto.modo_de_pagamento = modo_de_pagamento; }
    if ( tipo !== undefined ) {gasto.tipo = tipo; }
    if ( obs !== undefined ) {gasto.obs = obs; }

    try {
      await GastoService.save(gasto);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(200).send(gasto);
  }

}
