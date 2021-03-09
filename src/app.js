const express = require('express');
const artistControllers = require('./controllers/artists');
const artist = require('./models/artist');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.getArtistById);

app.post('/artists', artistControllers.create);

app.patch('/artists/:artistId', artistControllers.update);

module.exports = app;