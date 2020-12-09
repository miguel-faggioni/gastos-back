import { Router, validator } from 'camesine';
import * as express from 'express';
import { HealthController } from '../controllers/Health.controller';

export class HealthRouter extends Router {
  constructor() {
    super(HealthController);
    this.router = express.Router()
                         .get('/ping', this.handler(HealthController.prototype.ping))
                         .get('/version', this.handler(HealthController.prototype.version))
                         .get('/uptime', this.handler(HealthController.prototype.uptime))
    ;
  }
}
