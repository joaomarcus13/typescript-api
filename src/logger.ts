import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true, ignore: 'pid,hostname' },
});

const logger = pino({ level: 'info' }, transport);
export { logger };
