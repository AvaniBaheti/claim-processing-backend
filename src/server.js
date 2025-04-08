import express from "express";
import * as http from 'http';
import logger from "./config/logger.js";
import allV1Routes from '../src/routes/index.js'
import {  checkSqlDatabaseHealth, checkDatabaseConnection } from "./config/db/postgreSql.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const port = 5000;

const app = express();
const REQUEST_TIMEOUT = 900000;

// Create an HTTP server
const httpServer = http.Server;

// Middleware setup
app.use(express.json());
app.set('trust proxy', true);

app.use(cookieParser());
// app.use(cookieManager);
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


// Root endpoint for testing
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json("API Testing Successful!!");
});


// Health check for SQL database
app.get('/health', async (req, res) => {
  const healthStatus = await checkSqlDatabaseHealth();
  if (healthStatus.status === 'healthy') {
    res.status(StatusCodes.OK).json(healthStatus);
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(healthStatus);
  }
});



// Use v1 routes
app.use('/api/v1', allV1Routes);

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error("Invalid request");
  res.status(StatusCodes.NOT_FOUND);
  next(error);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  if (req.expiredToken) {
    delete req.headers.authorization;
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Your token has been removed. Please log in again.",
    });
  }
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
});


// Start server function
async function startServer() {
  try {
    const server = app.listen(port, '0.0.0.0', async () => {
      logger.info(`Listening on port ${port}`);
      await checkDatabaseConnection();
    });

    // Error handling for EADDRINUSE
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

// Start the server
startServer();

// Gracefully shut down server and Agenda
const exitHandler = async () => {
  logger.info('Shutting down server...');
  process.exit(0);
};

// Handle unexpected errors
const unexpectedErrorHandler = (error) => {
  logger.error("Unexpected error:", error);
};

// Handle process termination signals
process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
