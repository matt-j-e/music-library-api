const { expect } = require('chai');
const request = require('supertest');
const { Artist } = require('../src/models');
const app = require('../src/app');

describe('/artists', () => {
    before(done => {
        Artist.sequelize
            .sync()
            .then(() => done())
            .catch(error => done(error));
    })

    beforeEach(done => {
        Artist.destroy({ where: {} })
            .then(() => done())
            .catch(error => done(error));
    })

    describe('POST /artists', (done) => {
        it('creates a new artist in the database', done => {
            request(app).post('/artists').send({
                name: 'Tame Impala',
                genre: 'Rock'
            }).then(response => {
                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Tame Impala');
                expect(response.body.genre).to.equal('Rock');

                Artist.findByPk(response.body.id, { raw: true }).then(insertedArtistRecord => {
                    expect(insertedArtistRecord.name).to.equal('Tame Impala');
                    expect(insertedArtistRecord.genre).to.equal('Rock');
                });
                done();
            }).catch(error => done(error));
        });
    });

    describe('with artists in the database', () => {
        let artists;
        beforeEach((done) => {
            Promise.all([
                Artist.create({ name: "Tame Impala", genre: "Rock" }),
                Artist.create({ name: "Kylie Minogue", genre: "Pop" }),
                Artist.create({ name: "Dave Brubeck", genre: "Jazz" })
            ]).then((documents) => {
                artists = documents;
                done();
            });
        });

        describe('GET /artists', () => {
            it('gets all artist records', (done) => {
                request(app)
                    .get('/artists')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.length).to.equal(3);
                        res.body.forEach((artist) => {
                            const expected = artists.find((a) => a.id === artist.id);
                            expect(artist.name).to.equal(expected.name);
                            expect(artist.genre).to.equal(expected.genre);
                        });
                        done();
                    })
                    .catch(error => done(error));
            });
        });

        describe('GET /artists/:artistId', () => {
            it('gets artist record by id', (done) => {
                const artist = artists[0];
                request(app)
                    .get(`/artists/${artist.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal(artist.name);
                        expect(res.body.genre).to.equal(artist.genre);
                        done();
                    }).catch(error => done(error));
            });

            it('returns a 404 if the artist does not exist', (done) => {
                request(app)
                    .get('/artists/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The artist could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('PATCH /artists/:id', () => {
            it('updates artist genre by id', (done) => {
                const artist = artists[0];
                request(app)
                    .patch(`/artists/${artist.id}`)
                    .send({  genre: 'Psychedelic Rock' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
                            expect(updatedArtist.genre).to.equal('Psychedelic Rock');
                            expect(updatedArtist.name).to.equal('Tame Impala');
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('updates artist name by id', (done) => {
                const artist = artists[1];
                request(app)
                    .patch(`/artists/${artist.id}`)
                    .send({ name: 'Spice Girls' })
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
                            expect(updatedArtist.name).to.equal('Spice Girls');
                            expect(updatedArtist.genre).to.equal('Pop');
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('returns a 404 if the artist does not exist', (done) => {
                request(app)
                    .patch('/artists/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The artist could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });

        describe('DELETE /artists/:artistId', () => {
            it('deletes artist record by id', (done) => {
                const artist = artists[0];
                request(app)
                    .delete(`/artists/${artist.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
                            expect(updatedArtist).to.equal(null);
                            done();
                        }).catch(error => done(error));
                    }).catch(error => done(error));
            });

            it('returns a 404 if the artist does not exist', (done) => {
                request(app)
                    .delete('/artists/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The artist could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });
    });

});