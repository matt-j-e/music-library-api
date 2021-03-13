const { Artist, Album, Song } = require('../models');

exports.createSong = (req, res) => {
    Album.findByPk(req.params.albumId).then(album => {
        if (!album) {
            res.status(404).json({ error: "The album could not be found." });
        } else {
            req.body.albumId = parseInt(req.params.albumId);
            req.body.artistId = album.artistId;
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
    }).then(song => {
        if (!song) {
            res.status(404).json({ error: "That songId cannot be found." });
        } else {
            res.status(200).json(song);
        }
    });
};

exports.getSongsByArtistId = (req, res) => {
    Song.findAll({
        where: {
            artistId: req.params.artistId
        }
    }).then(songs => {
        if (songs.length === 0) {
            res.status(404).json({ error: "There are no songs associated with that artistId" });
        } else {
            res.status(200).json(songs);
        }
    });
};
