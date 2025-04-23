const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Search books by author
router.get('/search', async (req, res) => {
  try {
    const authorQuery = req.query.author;
    
    if (!authorQuery) {
      return res.status(400).json({ error: 'Author query parameter is required' });
    }

    const books = await Book.find({
      author: { $regex: authorQuery, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, price } = req.body;
    
    if (!title || !author || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const book = new Book({ title, author, price });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;