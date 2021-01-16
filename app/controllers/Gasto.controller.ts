import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
import { Gasto } from '../models/Gasto.model';
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
import * as csv_stringify from 'csv-stringify';

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
    // TODO: permitir selecionar startDate e endDate
    // TODO: permitir escolher se quer 1 worksheet por ano/mes/tudo junto
    const format = this.req.params.format;

    let token, gastos;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      gastos = await GastoService.findManyBy({
        pessoa: {id: token.id},
      }, {
        relations: ['categoria', 'modo_de_pagamento', 'data'],
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    switch (format) {
      case 'csv':
        // create stream
        const Stream = require('stream');
        const csvStream = new Stream.CsvStream({objectMode: true});

        // add values to stream
        gastos.forEach((gasto) => {
          csvStream.push({
            'valor': gasto.valor,
            'categoria': gasto.categoria.nome,
            'modo de pagamento': gasto.modo_de_pagamento.nome,
            'data': `${gasto.data.dia}/${gasto.data.mes}/${gasto.data.ano} - ${gasto.data.hora}h${gasto.data.minuto}`
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
            { name: 'data', value: (gasto: Gasto) => `${gasto.data.dia}/${gasto.data.mes}/${gasto.data.ano} - ${gasto.data.hora}h${gasto.data.minuto}`, },
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
    const { data, valor } = this.req.body as { data: string, valor: number };
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

    try {
      await GastoService.save(gasto);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(201).send();
  }

  public async update(): Promise<express.Response> {
    const { data, valor } = this.req.body as { data: string, valor: number };
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

    try {
      await GastoService.save(gasto);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

}
