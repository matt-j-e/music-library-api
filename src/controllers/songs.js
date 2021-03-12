const { Artist, Album, Song } = require('../models');

exports.createSong = (req, res) => {
    Album.findByPk(req.params.albumId).then(album => {
        if (!album) {
            res.status(404).json({ error: "The album could not be found." });
        } else {
            req.body.albumId = parseInt(req.params.albumId);
            Song.create(req.body)
                .then(song => res.status(201)
                .json(song));
        }
    }); 
};

exports.getSongs = (req, res) => {
    Song.findAll({
        include: [
            { model: Artist, as: 'artist' },
            { model: Album, as: 'album' },
        ]
    }).then(songs => res.status(200)
    .json(songs));
};

exports.getSongById = (req, res) => {
    Song.findOne({
        where: {
            id: req.params.songId
        },
        include: [
            { model: Artist, as: 'artist' },
            { model: Album, as: 'album' },
        ]
    }).then(song => res.status(200)
    .json(song));
};
