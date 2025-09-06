'use strict';

import './loadEnv.js';

import http from 'http';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import responseTime from 'response-time';

import { appSettings } from './config/index.js';
import api from './api/index.js';
import { ErrorHandlerMiddleware } from './api/middlewares/index.js';
import { ErrorHandler } from './api/utils/index.js';

const app = express();

// Enable trust proxy (useful if behind reverse proxy)
app.set('trust proxy', true);

// Add X-Response-Time header
app.use(responseTime());

// Compress responses
app.use(compression());

// Secure headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'x-access-token',
        'visitorid',
        'language',
        'Authorization'
    ]
}));

// Handle preflight OPTIONS requests
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: false,
    parameterLimit: 10000,
    limit: '10mb',
}));

// Parse application/json
app.use(express.json({ limit: '30mb' }));

// Register routes
app.use('/api', api);

// Error handling middleware (should come last)
app.use(ErrorHandlerMiddleware.handleError);

// Start server
const httpServer = http.createServer(app);

httpServer.listen(appSettings.port, () => {
    ErrorHandler.logMessage(`Server running at port ${appSettings.port}`, false);
});


