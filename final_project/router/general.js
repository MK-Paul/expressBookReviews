const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { password };
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN" });
  }
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/async/books', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((bookList) => {
      res.status(200).json(bookList);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving books" });
    });
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 12: Get book details based on Author using Promises
public_users.get('/async/author/:author', (req, res) => {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for the given author");
    }
  })
    .then((filteredBooks) => {
      res.status(200).json(filteredBooks);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Task 13: Get book details based on Title using Async-Await
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const filteredBooks = await new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found for the given title");
      }
    });
    res.status(200).json(filteredBooks);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
