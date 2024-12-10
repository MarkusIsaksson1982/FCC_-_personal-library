/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

'use strict';
const { v4: uuidv4 } = require('uuid');

let books = {}; // In-memory storage for books

module.exports = function (app) {
  // Route to handle all books
  app.route('/api/books')
    .get((req, res) => {
      const allBooks = Object.values(books).map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length,
      }));
      res.json(allBooks);
    })
    .post((req, res) => {
      const { title } = req.body;
      if (!title) {
        return res.status(400).send('missing required field title');
      }
      const newBook = {
        _id: uuidv4(),
        title,
        comments: [],
      };
      books[newBook._id] = newBook;
      res.json(newBook);
    })
    .delete((req, res) => {
      books = {};
      res.send('complete delete successful');
    });

  // Route to handle individual books
  app.route('/api/books/:id')
    .get((req, res) => {
      const book = books[req.params.id];
      if (!book) {
        return res.status(404).send('no book exists');
      }
      res.json(book);
    })
    .post((req, res) => {
      const book = books[req.params.id];
      const { comment } = req.body;
      if (!book) {
        return res.status(404).send('no book exists');
      }
      if (!comment) {
        return res.status(400).send('missing required field comment');
      }
      book.comments.push(comment);
      res.json(book);
    })
    .delete((req, res) => {
      const book = books[req.params.id];
      if (!book) {
        return res.status(404).send('no book exists');
      }
      delete books[req.params.id];
      res.send('delete successful');
    });
};
