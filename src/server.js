import express from "express";
import * as http from 'http';
import logger from "./config/logger.js";
import allV1Routes from '../src/routes/index.js';
import { initializeDatabase, checkSqlDatabaseHealth } from "./config/db/postgreSql.js";
import dotenv from 'dotenv';
import AppDataSource from './config/db/postgreSql.js';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const REQUEST_TIMEOUT = 900000;

app.use(express.json());
app.set('trust proxy', true);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use((req, res, next) => {
  res.setTimeout(REQUEST_TIMEOUT, () => {
    logger.error(`Request to ${req.originalUrl} timed out after ${REQUEST_TIMEOUT / 1000} seconds`);
    res.status(StatusCodes.REQUEST_TIMEOUT).json({
      message: 'Request timed out, please try again later.',
    });
  });
  next();
});

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json("API Testing Successful!!");
});


app.use('/api', allV1Routes);

app.use((req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid request" });
});

app.use((error, req, res, next) => {
  if (req.expiredToken) {
    delete req.headers.authorization;
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Your token has been removed. Please log in again.",
    });
  }
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
});

async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(port, () => {
      logger.info(`Server is listening on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${port} is already in use. Please choose another port.`);
      } else {
        logger.error("An error occurred:", error);
      }
      setTimeout(() => process.exit(1), 1000);
    });
  } catch (err) {
    logger.error("Error starting server:", err);
    setTimeout(() => process.exit(1), 1000);
  }
}

startServer();

