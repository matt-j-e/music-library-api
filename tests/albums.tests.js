/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
    let artist;

    before(async () => {
        try {
            await Artist.sequelize.sync();
            await Album.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Artist.destroy({ where: {} });
            await Album.destroy({ where: {} });
            artist = await Artist.create({
                name: 'Tame Impala',
                genre: 'Rock',
            });
        } catch (err) {
            console.log(err);
        }
    });

    describe('POST /artists/:artistId/albums', () => {
        it('returns a 404 and does not create an album if the artist does not exist', (done) => {
            request(app)
                .post('/artists/1234/albums')
                .send({
                    name: 'InnerSpeaker',
                    year: 2010,
                })
                .then((res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('The artist could not be found.');
                    
                    Album.findAll().then((albums) => {
                        expect(albums.length).to.equal(0);
                        done();
                    })
                }).catch(error => done(error));
        });
    
        
        it('creates a new album for a given artist', (done) => {
            request(app)
                .post(`/artists/${artist.id}/albums`)
                .send({
                    name: 'InnerSpeaker',
                    year: 2010,
                })
                .then((res) => {
                    expect(res.status).to.equal(201);

                    Album.findByPk(res.body.id, { raw: true }).then((album) => {
                        expect(album.name).to.equal('InnerSpeaker');
                        expect(album.year).to.equal(2010);
                        expect(album.artistId).to.equal(artist.id);
                        done();
                    }).catch(error => done(error));
                }).catch(error => done(error));
        });
    });

    describe('with albums in the database', () => {
        let albums;
        beforeEach((done) => {
            Promise.all([
                Album.create({ name: "InnerSpeaker", year: 2010, artistId: artist.id }),
                Album.create({ name: "Lonerism", year: 2012, artistId: artist.id }),
                Album.create({ name: "Currents", year: 2015, artistId: artist.id })
            ]).then((documents) => {
                albums = documents;
                // console.log(albums);
                done();
            }).catch(error => done(error));
        });

        describe('GET /albums', () => {
            it('gets all albums', (done) => {
                request(app)
                    .get('/albums')
                    .then((res) => {
                        // console.log(res.body);
                        expect(res.status).to.equal(200);
                        expect(res.body.length).to.equal(3);
                        res.body.forEach((album) => {
                            const expected = albums.find((a) => a.id === album.id);
                            expect(album.name).to.equal(expected.name);
                            expect(album.year).to.equal(expected.year);
                            expect(album.artistId).to.equal(expected.artistId);
                        });
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('GET /albums/:albumId', () => {
            it('gets album by album id', (done) => {
                const album = albums[0];
                request(app)
                    .get(`/albums/${album.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal('InnerSpeaker');
                        expect(res.body.year).to.equal(2010);
                        expect(res.body.artistId).to.equal(artist.id);
                        done();
                    }).catch(error => done(error));
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .get('/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('GET /artists/:artistId/albums', () => {

            it('returns a 404 if the artist does not exist', (done) => {
                request(app)
                    .get('/artists/12345/albums')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The artist could not be found.');
                        done();
                    }).catch(error => done(error));
            });

            it('gets all albums by artist', (done) => {
                request(app)
                    .get(`/artists/${artist.id}/albums`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.length).to.equal(3);
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('PATCH /albums/:albumId', () => {
            it('updates album year by id', (done) => {
                const album = albums[0];
                request(app)
                    .patch(`/albums/${album.id}`)
                    .send({ year: 2000 })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum.year).to.equal(2000);
                            expect(updatedAlbum.name).to.equal("InnerSpeaker");
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('updates album name by id', (done) => {
                const album = albums[1];
                request(app)
                    .patch(`/albums/${album.id}`)
                    .send({ name: "Weasels ripped my flesh" })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum.year).to.equal(2012);
                            expect(updatedAlbum.name).to.equal("Weasels ripped my flesh");
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .patch('/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('DELETE /albums/:albumId', () => {
            it('deletes album record by id', (done) => {
                const album = albums[0];
                request(app)
                    .delete(`/albums/${album.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                            expect(updatedAlbum).to.equal(null);
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('returns a 404 if the album does not exist', (done) => {
                request(app)
                    .delete('/albums/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The album could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });
    });
});