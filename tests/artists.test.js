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
                // const insertedArtistRecords = await Artist.findByPk(response.body.id, { raw: true });
                Artist.findByPk(response.body.id, { raw: true }).then(insertedArtistRecord => {
                    expect(insertedArtistRecord.name).to.equal('Tame Impala');
                    expect(insertedArtistRecord.genre).to.equal('Rock');
                });
                done();
            }).catch(error => done(error));
        });
    });

});