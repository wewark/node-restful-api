process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect

const fs = require('fs')
const JPEG = require('jpeg-js')
const pixelmatch = require('pixelmatch')


chai.use(chaiHttp)

describe('/POST /json/patch', () => {
    const username = 'khaled'
    const password = 'password123'
    const document = {
        name: 'khaled',
        power: 100,
    }
    const patch = {
        // op: 'replace', // TODO
    }
    const exp_doc = document // TODO
    
    it('rejects when not logged in', done => {
        chai.request(server)
            .post('/json/patch')
            .send({
                document: document,
                patch: patch,
            })
            .end((err, res) => {
                expect(err).null
                expect(res).status(401)
                done()
            })
    })

    it('accepts to patch when logged in', done => {
        chai.request(server)
            .post('/user/login')
            // .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                password: password
            })
            .end((err, res) => {
                chai.request(server)
                    .post('/json/patch')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .send({
                        document: JSON.stringify(document),
                        patch: JSON.stringify(patch),
                    })
                    .end((err, res) => {
                        expect(err).null
                        expect(res).status(200)
                        done()
                    })
            })
    })

    it('successfully patches document', done => {
        chai.request(server)
            .post('/user/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                password: password
            })
            .end((err, res) => {
                chai.request(server)
                    .post('/json/patch')
                    .send({
                        document: JSON.stringify(document),
                        patch: JSON.stringify(patch),
                    })
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        expect(err).null
                        expect(res).status(200)
                        expect(res.body.document).eql(exp_doc)
                        done()
                    })
            })
    })
})
