'use strict';

import express from 'express';

import { UsersController } from './controllers/index.js';

const router = express.Router();
router.use('/users', UsersController);

export default router;
