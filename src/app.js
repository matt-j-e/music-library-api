const express = require('express');
const artistControllers = require('./controllers/artists');
const artist = require('./models/artist');
const albumControllers = require('./controllers/albums');
const album = require('./models/album');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

app.get('/artists', artistControllers.list);
app.get('/artists/:artistId', artistControllers.getArtistById);
app.post('/artists', artistControllers.create);
app.patch('/artists/:artistId', artistControllers.update);
app.delete('/artists/:artistId', artistControllers.delete);

app.get('/albums', albumControllers.getAlbums);
app.get('/albums/:albumId', albumControllers.getAlbumById);
app.get('/artists/:artistId/albums', albumControllers.getAlbumsByArtistId);
app.post('/artists/:artistId/albums', albumControllers.createAlbum);

module.exports = app;