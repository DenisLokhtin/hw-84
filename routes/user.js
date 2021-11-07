const express = require('express');
const User = require('../models/User');

const router = express.Router();



router.post('/', async (req, res) => {
    const body = {
        username: req.body.username,
        password: req.body.password,
        token: ''
    };

    const Users = new User(body);

    try {
        User.generateToken();
        await Users.save();
        res.send(Users);
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

    const isMatch = await User.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(400).send({error: 'password is wrong'})
    }

    User.generateToken();
    await User.save();

    res.send({token: 'token'})
});

module.exports = router;