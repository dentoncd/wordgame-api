const express = require('express');
const router = express.Router();
const db = require('../db/database');

function getRequestById(requestId) {
    return db.prepare(`
        SELECT id, name, email, game, description, created_at
        FROM game_requests
        WHERE id = ?
    `).get(requestId);
}

// GET all game requests
router.get('/', (req, res) => {
    try {
        const requests = db.prepare(`
            SELECT id, name, email, game, description, created_at
            FROM game_requests
            ORDER BY created_at DESC
        `).all();

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game requests' });
    }
});

// GET one game request by id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid game request id' });
    }

    try {
        const request = getRequestById(id);
        if (!request) {
            return res.status(404).json({ error: 'Game request not found' });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the game request' });
    }
});

// POST create a new game request
router.post('/', (req, res) => {
    const { name, email, game, description } = req.body;

    if (!name || !email || !game || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = db.prepare(`
            INSERT INTO game_requests (name, email, game, description)
            VALUES (?, ?, ?, ?)
        `).run(name, email, game, description);

        const newRequest = getRequestById(result.lastInsertRowid);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create game request' });
    }
});

module.exports = router;