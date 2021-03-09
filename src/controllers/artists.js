const { Artist, Album } = require('../models');

exports.create = (req, res) => {
    // res.sendStatus(201);
    Artist.create(req.body)
        .then(artist => res.status(201)
        .json(artist));
};

exports.list = (req, res) => {
    Artist.findAll()
        .then(artists => res.status(200)
        .json(artists));
};

exports.getArtistById = (req, res) => {
    Artist.findByPk(req.params.artistId)
        .then(artist => {
            if (!artist) res.status(404).json({ error: "The artist could not be found." });
            else res.status(200).json(artist);
        })
};

exports.update = (req, res) => {
    Artist.update(req.body, { where: { id: req.params.artistId } })
        .then(rows => {
            if (rows[0] === 0) res.status(404).json({ error: "The artist could not be found." });
            else res.status(200).json(rows);
        });
};

exports.delete = (req, res) => {
    Artist.destroy({ where: { id: req.params.artistId } })
        .then(deletedRows => {
            if (!deletedRows) res.status(404).json({ error: "The artist could not be found." });
            else res.status(204).json(deletedRows);
        })
};