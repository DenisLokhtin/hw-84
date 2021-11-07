const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const task = require('./routes/task');
const user = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = 8001;

app.use('/task', task);
app.use('/user', user);


const run = async () => {
    await mongoose.connect('mongodb://localhost/music');

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run();


