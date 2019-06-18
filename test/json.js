process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect


chai.use(chaiHttp)

describe('/POST /json/patch', () => {
    const username = 'khaled'
    const password = 'password123'

    const testcases = [
        {
            document: {
                "baz": "qux",
                "foo": "bar"
            },
            patch: [
                { "op": "replace", "path": "/baz", "value": "boo" },
                { "op": "add", "path": "/hello", "value": ["world"] },
                { "op": "remove", "path": "/foo" }
            ],
            exp_result: {
                "baz": "boo",
                "hello": ["world"]
            },
        },
        {
            document: {
                "name": "khaled"
            },
            patch: [],
            exp_result: {
                "name": "khaled"
            },
        },
        {
            document: {
                "name": "khaled"
            },
            patch: [
                { "op": "replace", "path": "/name", "value": "hamed" },
                { "op": "add", "path": "/power", "value": 100 },
                { "op": "add", "path": "/arr", "value": { "okay": true } }
            ],
            exp_result: {
                "name": "hamed",
                "power": 100,
                "arr": {
                    "okay": true
                }
            },
        }
    ]

    it('rejects when not logged in', done => {
        chai.request(server)
            .post('/json/patch')
            .send({
                document: JSON.stringify(testcases[0].document),
                patch: JSON.stringify(testcases[0].patch),
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
                        document: JSON.stringify(testcases[0].document),
                        patch: JSON.stringify(testcases[0].patch),
                    })
                    .end((err, res) => {
                        expect(err).null
                        expect(res).status(200)
                        done()
                    })
            })
    })

    describe('Patching', () => {
        let authToken = ''
        before('login', done => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    username: username,
                    password: password
                })
                .end((err, res) => {
                    authToken = res.body.token
                    done()
                })
        })

        testcases.forEach((testcase, i) => {
            it('successfully patches document ' + (i + 1), done => {
                chai.request(server)
                    .post('/json/patch')
                    .send({
                        document: JSON.stringify(testcase.document),
                        patch: JSON.stringify(testcase.patch),
                    })
                    .set('Authorization', 'Bearer ' + authToken)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        expect(err).null
                        expect(res).status(200)
                        expect(res.body.document).eql(testcase.exp_result)
                        done()
                    })
            })
        })
    })
})
