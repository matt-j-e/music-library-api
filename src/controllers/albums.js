const { Artist, Album } = require('../models');

exports.createAlbum = (req, res) => {
    Artist.findByPk(req.params.artistId).then(artist => {
        if (!artist) res.status(404).json({ error: "The artist could not be found." });
    });
    req.body.artistId = req.params.artistId;
    Album.create(req.body)
        .then(album => res.status(201)
        .json(album));
};

exports.getAlbums = (req, res) => {
    Album.findAll()
        .then(albums => res.status(200)
        .json(albums));
};

exports.getAlbumById = (req, res) => {
    Album.findByPk(req.params.albumId)
        .then(album => {
            if (!album) res.status(404).json({ error: "The album could not be found." });
            else res.status(200).json(album);
        })
};

exports.getAlbumsByArtistId = (req, res) => {
    Artist.findByPk(req.params.artistId)
        .then((artist) => {
            if (!artist) res.status(404).json({ error: "The artist could not be found." });
        });
    Album.findAll({ where: { artistId: req.params.artistId } })
        .then(albums => res.status(200)
        .json(albums));
};