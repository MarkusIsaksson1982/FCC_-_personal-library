/* I have utilized ChatGPT and Perplexity as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

'use strict';

const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(process.env.DB, {});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {
  app.route('/api/books')
    .get(async (req, res) => {
      const books = await Book.find({});
      res.json(books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length,
      })));
    })
    .post(async (req, res) => {
      const { title } = req.body;
      if (!title) {
        return res.status(200).send('missing required field title');
      }
      const newBook = new Book({ title });
      await newBook.save();
      res.json({ _id: newBook._id, title: newBook.title });
    })
    .delete(async (req, res) => {
      await Book.deleteMany({});
      res.send('complete delete successful');
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).send('no book exists');
      }
      const book = await Book.findById(id);
      if (!book) {
        return res.status(200).send('no book exists');
      }
      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments,
      });
    })
    .post(async (req, res) => {
      const { id } = req.params;
      const { comment } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).send('no book exists');
      }
      const book = await Book.findById(id);
      if (!book) {
        return res.status(200).send('no book exists');
      }
      if (!comment) {
        return res.status(200).send('missing required field comment');
      }
      book.comments.push(comment);
      await book.save();
      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments,
      });
    })
    .delete(async (req, res) => {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).send('no book exists');
      }
      const book = await Book.findById(id);
      if (!book) {
        return res.status(200).send('no book exists');
      }
      await Book.deleteOne({ _id: id });
      res.send('delete successful');
    });
};
