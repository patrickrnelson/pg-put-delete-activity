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
  // STRETCH - listener for edit buttoin
  $(document).on('click', '#editBtn', onEditClick);
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
        <td><button id="editBtn" data-title="${book.title}" data-author="${book.author}" data-id="${book.id}">Edit</button></td>
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

// ***STRETCH***

editBookID = 0;

function onEditClick() {
  console.log('edit click');
  let thisBookTitle = $(this).data('title');
  let thisBookAuthor = $(this).data('author');
  let thisBookID = $(this).data('id');
  editBookID = thisBookID;

  // listen for a submit click
  $('#submitBtn').on('click', onEditSubmit);

  function editView() {
    // empty the 'Add new Book' title
    // append 'Edit book' instead
    $('#addEditTitle').empty();
    $('#addEditTitle').append('Edit Book');
    // change the background color of the section to indicate the change
    $('#addEditSection').addClass('edit-section');
    // append a cancel button
    $('#addEditSection').append(
      `<button type="button" id="cancelEditBtn">Cancel</button>`
    );
    // cancel button listener
    $('#cancelEditBtn').on('click', function () {
      // switch everything back to normal on cancel
      $('#addEditTitle').empty();
      $('#addEditTitle').append('Add New Book');
      $('#addEditSection').removeClass('edit-section');
      $('#author').val('');
      $('#title').val('');
      $(this).remove();
    });
    // fill the inputs with the desired info to edit
    $('#author').val(thisBookAuthor);
    $('#title').val(thisBookTitle);
  }

  function editBook(bookID) {
    let bookTitle = $('#title').val();
    let bookAuthor = $('#author').val();
    $.ajax({
      method: 'PUT',
      // need the book ID in the url
      // can grab with data-id
      // will get with the click handler
      url: `/books/edit/${bookID}`,
      data: {
        author: bookAuthor,
        title: bookTitle,
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
  function onEditSubmit() {
    editBook(editBookID);
    $('#author').val('');
    $('#title').val('');
  }
  editView();
}
