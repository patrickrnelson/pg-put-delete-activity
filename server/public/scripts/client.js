$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $(document).on('click', '#statusBtn', onStatusClick);
  $(document).on('click', '#deleteBtn', onDeleteClick);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  })
    .then(function (response) {
      console.log('Response from server.', response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log('Error in POST', error);
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log('error in GET', error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td class="isReadStatus">${book.isRead}</td>
        <td><button id="statusBtn" data-id="${book.id}">Change Status</button></td>
        <td><button id="deleteBtn" data-id="${book.id}">DELETE</button></td>
      </tr>
    `);
  }
}

// Edit book status
// we will call this funciton inside of the click handler function
// in order to pass the book ID and statusChange
function changeReadStatus(bookID, currentStatus) {
  $.ajax({
    method: 'PUT',
    // need the book ID in the url
    // can grab with data-id
    // will get with the click handler
    url: `/books/isRead/${bookID}`,
    data: {
      currentStatus: currentStatus,
    },
  })
    .then(function (response) {
      refreshBooks();
    })
    .catch(function (err) {
      console.log('error', err);
      alert('Error! Try again later');
    });
}

function onStatusClick() {
  console.log('Status Click');
  let thisBookID = $(this).data('id');
  let currentStatus = $(this).parent().siblings('.isReadStatus').text();
  changeReadStatus(thisBookID, currentStatus);
}

function deleteBook(bookID) {
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookID}`,
  })
    .then(function (response) {
      // refresh book data
      refreshBooks();
    })
    .catch(function (err) {
      console.log('error', err);
      alert('ERROR');
    });
}

function onDeleteClick() {
  console.log('Delete Click');
  let thisBookID = $(this).data('id');
  deleteBook(thisBookID);
}
