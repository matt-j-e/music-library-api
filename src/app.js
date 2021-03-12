const express = require('express');
const artistControllers = require('./controllers/artists');
const artist = require('./models/artist');
const albumControllers = require('./controllers/albums');
const album = require('./models/album');
const songControllers = require('./controllers/songs');
const song = require('./models/song');

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
app.patch('/albums/:albumId', albumControllers.update);
app.delete('/albums/:albumId', albumControllers.delete);

app.post('/albums/:albumId/song', songControllers.createSong);
app.get('/songs', songControllers.getSongs);
app.get('/songs/:songId', songControllers.getSongById);

module.exports = app;