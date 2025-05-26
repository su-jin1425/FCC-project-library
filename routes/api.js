'use strict';
const dbUtils = require('../db/dbUtils');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      dbUtils.getBooks({}, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      dbUtils.createBook(title, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
    })
    
    .delete(function(req, res){
      dbUtils.deleteBooks({}, (err, data) => {
        if (err) return res.send(err);
        return res.send("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      dbUtils.getBookById(bookid, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send("missing required field comment");
      dbUtils.addCommentById(bookid, comment, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      dbUtils.deleteBookById(bookid, (err, data) => {
        if (err) return res.send(err);
        return res.send("delete successful");
      });
    });
  
};
