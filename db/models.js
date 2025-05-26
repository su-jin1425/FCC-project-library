const { model } = require('mongoose');
const { BookSchema } = require('./schemas');

const Book = model('Book', BookSchema);

exports.Book = Book;
