import { Router, validator } from 'camesine';
import * as express from 'express';
import { AuthController } from '../controllers/Auth.controller';
import { authSchema } from '../schemas/Auth.schema';

export class AuthRouter extends Router {
  constructor() {
    super(AuthController);
    this.router = express
      .Router()
      .post('/', [ validator(authSchema.login) ], this.handler(AuthController.prototype.login))
      .post('/feedback', [ validator(authSchema.feedback) ], this.handler(AuthController.prototype.receiveFeedback))
      .post('/ping', [ validator(authSchema.ping) ], this.handler(AuthController.prototype.testToken))
      .post('/register', [ validator(authSchema.register) ], this.handler(AuthController.prototype.create))
    ;
  }
}
