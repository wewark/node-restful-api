process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect

const fs = require('fs')
const JPEG = require('jpeg-js')
const pixelmatch = require('pixelmatch')


chai.use(chaiHttp)

describe('Image', () => {
    describe('/POST create_thumb', () => {
        const username = 'khaled'
        const password = 'password123'

        // If this link is changed, the expected image test/resized_cat.jpg
        // must be changed to match it
        const img_url = 'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzEwNC84MTkvb3JpZ2luYWwvY3V0ZS1raXR0ZW4uanBn'

        it('rejects images when not logged in', done => {
            chai.request(server)
                .post('/img/create_thumb')
                .query({ img_url: img_url })
                .end((err, res) => {
                    expect(err).null
                    expect(res).status(401)
                    done()
                })
        })

        it('accepts to resize image when logged in', done => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: username,
                    password: password
                })
                .end((err, res) => {
                    chai.request(server)
                        .post('/img/create_thumb')
                        .query({ img_url: img_url })
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .buffer()
                        .end((err, res) => {
                            expect(err).null
                            expect(res).status(200)
                            done()
                        })
                })
        })

        it('successfully resizes image', done => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: username,
                    password: password
                })
                .end((err, res) => {
                    chai.request(server)
                        .post('/img/create_thumb')
                        .query({ img_url: img_url })
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .buffer()
                        .end((err, res) => {
                            expect(err).null
                            expect(res).status(200)

                            const test_img = res.body
                            const exp_img = fs.readFileSync('test/expected_cat.jpg')

                            const diffPixels = pixelmatch(
                                JPEG.decode(test_img).data,
                                JPEG.decode(exp_img).data,
                                null,
                                50, 50)
                            expect(diffPixels).equal(0)
                            done()
                        })
                })
        })
    })
})
