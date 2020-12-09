import { number, object, string } from 'joi';

export const authSchema = {
  login: object().keys({
    email: string().email().required(),
    senha: string().required(),
  }),
  register: object().keys({
    nome: string().required(),
    email: string().email().required(),
    senha: string().required(),
  }),
  ping: object().keys({
    token: string().required(),
  }),
  feedback: object().keys({
    text: string().required(),
  }),
};
