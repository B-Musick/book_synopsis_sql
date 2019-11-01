// https://puppet.com/docs/pipelines-for-apps/enterprise/application-nodejs-mocha.html

let assert = require('assert')
    
    chai = require('chai')
    chaiHttp = require('chai-http')
    request = require("request") //  Nodes request package to make request
    
    server = require('../server')
    should = chai.should()
    bookRoutes = require('../routes/books');

let base_url = 'http://localhost:3008/';
chai.use(chaiHttp);

describe("Book Synopsis Server", function () {
    describe("GET /", function () {
        it("returns status code 200", function (done) {
            chai.request(server)
                .get('/')
                .end(function (error, response) {
                //expect(response.statusCode).toBe(200);
                    response.should.have.status(200);
                done();
            });
        });
    });

    describe("GET /books", function () {
        it("returns status code 200", function (done) {
            chai.request(server)
                .get('/books')
                .end(function (error, response) {
                    //expect(response.statusCode).toBe(200);
                    response.should.have.status(200);
                    console.log(response.body);
                    done();
                });
        });
    });

    describe("GET /books/:title&:author", function () {
        it("returns status code 200", function (done) {
            chai.request(server)
                .get('/books')
                .query({title: 'The Art of Invisibility', author: 'Kevin D. Mitnick'})
                // .get('/books/The%20Art%20of%20Invisibility&Kevin%20D.%20Mitnick')
                .end(function (error, response) {
                    //expect(response.statusCode).toBe(200);
                    response.should.have.status(200);
                    // response.body.should
                    console.log(response);
                    done();
                });
        });
    });

});

