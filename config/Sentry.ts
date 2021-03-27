import { env } from 'process';
import { config } from '../config';
env.SENTRY_NAME = config.SERVERNAME;

export const SentryConfig = {
  dsn: config.SENTRY,
  release: config.VERSION,
  environment: ( config.SERVERNAME === 'localhost' ? 'development' : 'production' ),
  tracesSampleRate: 1.0,
};
