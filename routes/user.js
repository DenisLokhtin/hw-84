const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const body = {
        username: req.body.username,
        password: req.body.password,
        token: ''
    };

    const Username = await User.findOne({username: req.body.username});

    if (Username) {
            return res.status(418).send({error: 'Such user already exists!'});
    }

    const user = new User(body);

    try {
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (e) {
        console.log(e)
        res.sendStatus(400);
    }
});

router.post('/sessions', async (req, res) => {
    const token = req.get('Authorization')

    if (!token) {
        return res.status(401).send({error: 'No token present'})
    }

    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'Username not found'})
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(400).send({error: 'password is wrong'})
    }

    user.generateToken(10);
    await user.save();
    res.send({message: 'username and password correct', user})
});

module.exports = router;