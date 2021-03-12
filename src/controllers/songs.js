const { Artist, Album, Song } = require('../models');

exports.createSong = (req, res) => {
    // console.log(req.body, req.params.albumId); // logs all
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