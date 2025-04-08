import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});


const logger = createLogger({
  level: 'info', 
  format: combine(
    errors({ stack: true }), 
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    logFormat
  ),
  transports: [
    new transports.Console({
      level: 'debug', 
      format: combine(
        colorize(), 
        logFormat 
      )
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log', 
      datePattern: 'YYYY-MM-DD', 
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '14d',
      format: combine(
        json(), 
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
      )
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log', 
      datePattern: 'YYYY-MM-DD', 
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '30d', 
      level: 'error', 
      format: combine(
        json(), 
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
      )
    })
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
 
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

export default logger;
