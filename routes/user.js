const express = require('express');
const User = require("../models/User");

const router = express.Router();

router.get('/', async (req, res) =>{
    try{
        const users = await User.find();
        res.send(users);
    }catch (e){
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({error: "Data not valid"});
    }

    const userData = {
        username: req.body.username,
        password: req.body.password,
    };

    const user = new User(userData);


    try {
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (error) {
        res.sendStatus(500);
    }

});



router.post('/sessions', async (req,res)=>{
    const user = await User.findOne({username: req.body.username});

    if(!user){
        return res.status(401).send({error: "Username not found"});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch){
        return res.status(401).send({error: 'Password is wrong'});
    }

    user.generateToken();
    await user.save();
    res.send({token: user.token});

});



module.exports = router;