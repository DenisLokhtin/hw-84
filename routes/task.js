const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

const AuthorizationCheck = (req, res, next) => {
    const token = req.get('Authorization');
    if (!token) {
        return res.status(401).send({error: 'Token not provided!'});
    }
    next();
};

router.get('/', AuthorizationCheck, async (req, res) => {
    try {
        const query = {};
        if (req.query.album) {
            query.album = req.query.album
        }
        const Tasks = await Task.find(query);
        return res.send(Tasks);
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    const body = {};

    if (req.body.user) {
        return res.status(418).send({error: 'you cannot change user!'});
    }

    if (req.body.status) {
        body.status = req.body.status
    }

    if (req.body.title) {
        body.title = req.body.title
    }

    if (req.body.description) {
        body.description = req.body.description
    }

    try {
        const Tasks = await Task.findById(req.params.id);
        Task.updateOne({_id: req.params.id}, body, function (err, obj) {
            if (Tasks) {
                return res.send('done');
            } else {
                return res.sendStatus(404);
            }
        });

    } catch (e) {
        return res.sendStatus(500);
    }
});

router.post('/', AuthorizationCheck, async (req, res) => {
    const body = {
        user: req.body.user,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    };

    const Tasks = new Task(body);

    try {
        await Tasks.save();
        return res.send(Tasks);
    } catch (e) {
        return res.sendStatus(400);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const Tasks = await Task.findById(req.params.id);
        Task.deleteOne({_id: req.params.id}, function (err, obj) {
            if (Tasks) {
                return res.send('done');
            } else {
                return res.sendStatus(404);
            }
        });
    } catch (e) {
        return res.sendStatus(500);
    }
});

module.exports = router;
