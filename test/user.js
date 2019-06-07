process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect

const jwt = require('jsonwebtoken')

chai.use(chaiHttp)
describe('User', () => {
    describe('/POST login', () => {
        const username = 'khaled'
        const password = 'password123'

        it('logs in with any username or password', done => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: username,
                    password: password
                })
                .end((err, res) => {
                    expect(err).null
                    expect(res).status(200)
                    const json = JSON.parse(res.text)
                    expect(json).keys('message', 'token')
                    done()
                })
        })

        it('returns a valid token', done => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: username,
                    password: password
                })
                .end((err, res) => {
                    const json = JSON.parse(res.text)
                    const token = json.token
                    const decoded = jwt.verify(token, process.env.JWT_KEY)
                    chai.expect(decoded.username).equal(username)
                    done()
                })
        })
    })
})
