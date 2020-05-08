const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /Apps', () => {
    it('should return an array of Apps', () => {
        return supertest(app)
            .get('/Apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.lengthOf(20)
            });
    })
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'abc' })
            .expect(400, 'Can only sort by rating or app');
    });

    it('should be 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'Abc' })
            .expect(400, 'can only filter by Action,Puzzle,Strategy,Casual,Arcade,or Card')
    });

    it('should be 200 if genre is correct', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'action' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.lengthOf(6)
            });
    });

    it('should return apps sorted by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'rating' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.lengthOf(20)

                res.body.forEach((app, index) => {
                    if (index > 0) {
                        expect(app.Rating).to.be.lte(res.body[index - 1].Rating)
                    }
                })
            });
    });

    it('should return apps sorted by app', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'app' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.be.lengthOf(20)

                res.body.forEach((app, index) => {
                    if (index > 0) {
                        expect(app.App.localeCompare(res.body[index - 1].App)).to.be.gte(0)
                    }
                })
            });
    });


});