const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const endPoint = '/api/books';
let testBook;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const testTitle = "Test Book";
        chai.request(server)
          .post('/api/books')
          .send({"title": testTitle})
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, testTitle);
            assert.property(res.body, '_id');
            testBook = res.body;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post(endPoint)
          .send({"title": ""})
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title")
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get(endPoint)
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "comments");
            assert.property(res.body[0], "commentcount");
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get(endPoint + '/not_in_database_id')
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(endPoint + '/' + testBook._id)
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, testBook.title);
            assert.equal(res.body._id, testBook._id);
            assert.isEmpty(res.body.comments);
            assert.equal(res.body.commentcount, 0);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const testComment = "This is a test comment.";

        chai
          .request(server)
          .post(endPoint + '/' + testBook._id)
          .send({"comment": testComment})
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, testBook.title);
            assert.equal(res.body._id, testBook._id);
            assert.equal(res.body.comments[0], testComment);
            assert.equal(res.body.commentcount, 1);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post(endPoint + '/' + testBook._id)
          .send({"comment": ""})
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const testComment = "test comment";
        chai
          .request(server)
          .post(endPoint + '/this_book_id_does_not_exist')
          .send({"comment": testComment})
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(endPoint + '/' + testBook._id)
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const nonExistantId = "this_id_does_not_exist";

        chai.request(server)
          .delete(endPoint + '/' + nonExistantId)
          .end((err, res) => {
            assert.notExists(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});