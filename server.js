const express = require('express');
const router = require('./data/express-router');
const server = express();

server.use(express.json());

server.use('/api/posts', router);

server.get('/', (req, res) => {
    res.send(`<h2>Hello!</h2>`);
});

module.exports = server;
