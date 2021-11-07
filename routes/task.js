const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.album) {
            query.album = req.query.album
        }
        const Tracks = await Task.find(query);
        res.send(Tracks);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const Tracks = await Task.findById(req.params.id);

        if (Tracks) {
            res.send(Tracks);
        } else {
            res.sendStatus(404).send({error: 'Tracks not found'})
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const body = {
        title: req.body.title,
        album: req.body.album,
        duration: req.body.duration
    };

    const tracks = new Task(body);

    try {
        await tracks.save()
        res.send(tracks);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;