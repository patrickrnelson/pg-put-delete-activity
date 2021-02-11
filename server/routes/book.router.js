const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/', (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool
    .query(queryText, [newBook.author, newBook.title])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/isRead/:id', (req, res) => {
  console.log('req.body', req.body);
  console.log('req.params', req.params);
  let bookID = req.params.id;

  // Current Status will come from the request body
  // Expected to be true or false

  let currentStatus = req.body.currentStatus;
  let sqlText = '';

  if (currentStatus === 'false') {
    // if we receive a currentStatus that = 'false'
    // set the isRead column to True
    sqlText = `UPDATE books SET "isRead"=TRUE WHERE id=$1`;
    // else if we receive a statusChange that = 'unread'
    // set the isRead column to False
  } else if (currentStatus === 'true') {
    sqlText = `UPDATE books SET "isRead"=FALSE WHERE id=$1`;
  } else {
    // If we don't get an expected direction, send back bad status
    console.log('Whoops');
    res.sendStatus(500);
    return; // Do it now, doesn't run the next set of code
  }

  pool
    .query(sqlText, [bookID])
    .then((dbRes) => {
      console.log(dbRes);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('error', err);
      res.sendStatus(500);
    });
});

// STRETCH edit PUT
router.put('/edit/:id', (req, res) => {
  console.log('req.body', req.body);
  console.log('req.params', req.params);
  let bookID = req.params.id;

  // Current Status will come from the request body
  // Expected to be true or false

  let author = req.body.author;
  let title = req.body.title;
  let sqlText = ``;

  if (bookID > 0) {
    // if we receive a currentStatus that = 'false'
    // set the isRead column to True
    sqlText = `UPDATE books 
    SET "author"='${author}',
        "title"='${title}'
    WHERE id=$1`;
  } else {
    // If we don't get an expected direction, send back bad status
    console.log('Whoops');
    res.sendStatus(500);
    return; // Do it now, doesn't run the next set of code
  }

  pool
    .query(sqlText, [bookID])
    .then((dbRes) => {
      console.log(dbRes);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('error', err);
      res.sendStatus(500);
    });
});

// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id

router.delete('/:id', (req, res) => {
  let reqID = req.params.id;
  let sqlText = `DELETE FROM "books" WHERE "id"=$1;`;
  pool
    .query(sqlText, [reqID])
    .then((dbRes) => {
      console.log('Book deleted', dbRes);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('error making db connection', err);
      res.sendStatus(500);
    });
});

module.exports = router;
