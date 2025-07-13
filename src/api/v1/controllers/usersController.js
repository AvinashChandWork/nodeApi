'use strict';

import express from 'express';

import { UsersService } from '../services/index.js';

const router = express.Router();

router.post('/create-user', async (req, res) => {
    const { email, password, name } = req.body;
    const { status, body } = await UsersService.handleUserAuthentication({ email, password, name });
    res.status(status).json(body);
});

router.get('/get-users', async (req, res) => {
    const { email, name } = req.query;
    const token = req.headers['authorization']; 

    try {
        const { status, body } = await UsersService.getUsers(token, email, name);
        res.status(status).json(body);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


router.put('/update-user', async (req, res) => {
    const token = req.headers['authorization'];
    const { newEmail, name, oldEmail } = req.body;
    const { status, body } = await UsersService.updateUser(token, oldEmail, newEmail, name);
    res.status(status).json(body);
});

export default router;
