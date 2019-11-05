// https://puppet.com/docs/pipelines-for-apps/enterprise/application-nodejs-mocha.html

let assert = require('assert')
    
    chai = require('chai')
    chaiHttp = require('chai-http')
    request = require("request") //  Nodes request package to make request
    expect = chai.expect;
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
                    // console.log(response);
                    done();
                });
        });
    });

    describe("GET /books/create", function () {
        it("returns status code 200", function (done) {
            chai.request(server)
                .get('/books/create')
                .end(function (error, response) {
                    //expect(response.statusCode).toBe(200);
                    response.should.have.status(200);
                    done();
                });
        });
    });


    describe('POST /books, post a new book into repository', ()=>{
        it("returns status code 200", function (done) {
            chai.request(server)
                .post('/books')
                .type('form')
                .send({
                    'title': 'We Are Anonymous',
                    'author':'Perry Olson',
                    'image':'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1336065338l/13528420.jpg',
                    // 'username': 'brendanmusick'
                })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                })
                
        });
    })

    // describe('PUT /books/update update the book', () => {
    //     it("returns status code 200", function (done) {
    //         chai.request(server)
    //             .post('/:title&:author')
    //             .query({ title: 'The Art of Invisibility', author: 'Kevin D. Mitnick' })
    //             .type('form')
    //             .send({
    //                 '_method': 'put',
    //                 'title': 'We Were Anonymous',
    //                 'author': 'Perry Olson',
    //                 'image': 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1336065338l/13528420.jpg'
                    
    //                 // 'username': 'brendanmusick'
    //             })
    //             .end(function (err, res) {
    //                 expect(err).to.be.null;
    //                 expect(res).to.have.status(200);
    //                 done();
    //             })
    //     })

    // })

    describe('GET /authorize?username=brendanmusick&password=brendanmusick&email=test%40test.com for login route',()=>{

    });

    /********************************** SYNOPSIS ROUTES ******************************/
    describe('GET /synopsis/:title&:author/create form page for creating synopsis on specific book', () => {
        it('returns status code 200',(done)=>{
            chai.request(server)
                .get('/synopsis/:title&:author/create')
                .query({ title: 'The Art of Invisibility', author: 'Kevin D. Mitnick' })
                .end((error, response)=> {
                    response.should.have.status(200);
                    done();
                });
        })
    });


});

/******* HOW TO RUN
 * mocha
 * node test
 */