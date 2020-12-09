import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
const packageJSON = require('../../package.json');

export class HealthController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async ping(): Promise<express.Response> {
    return this.res.status(200).send();
  }

  public async version(): Promise<express.Response> {
    return this.res.status(200).send(packageJSON.version);
  }

  public async uptime(): Promise<express.Response> {
    const uptime = process.uptime();
    const date = new Date(uptime * 1000);
    const days = date.getUTCDate() - 1,
          hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();

    const segments = [];

    if (days > 0) { segments.push(days + ' dia' + ((days === 1) ? '' : 's')); }
    if (hours > 0) { segments.push(hours + ' hora' + ((hours === 1) ? '' : 's')); }
    if (minutes > 0) { segments.push(minutes + ' minuto' + ((minutes === 1) ? '' : 's')); }
    if (seconds > 0) { segments.push(seconds + ' segundo' + ((seconds === 1) ? '' : 's')); }
    if (milliseconds > 0) { segments.push(milliseconds + ' milisegundo' + ((seconds === 1) ? '' : 's')); }
    const dateString = segments.join(', ');

    return this.res.status(200).send(dateString);
  }

}
