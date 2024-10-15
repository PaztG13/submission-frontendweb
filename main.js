// This following scripts will executed when the HTML file is loaded.
document.addEventListener('DOMContentLoaded', function() {
  
    // Collecting the HTML elements needed
    const inputBook = document.getElementById('bookForm');
    const bookSubmit = document.getElementById('bookFormSubmit');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    // Creating arrays to save book list
    let books = [];

    // Checking if there is any book datas in the localStorage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }

    // Function : Save books data to localStorage
    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Handling the form submission to add another book
    inputBook.addEventListener('submit', function (e) {
        e.preventDefault();

        // Getting values from the form inputs
        const inputBookTitle = document.getElementById('bookFormTitle');
        const inputBookAuthor = document.getElementById('bookFormAuthor');
        const inputBookYear = document.getElementById('bookFormYear');
        const inputBookIsComplete = document.getElementById('bookFormIsComplete');

        // Create a new book object
        const book = {
            id: new Date().getTime,
            title: inputBookTitle.value,
            author: inputBookAuthor.value,
            year: inputBookYear.value,
            isComplete: inputBookIsComplete.checked,
        };

        // Adding book to the list and save to the localStorage
        books.push(book);
        saveBooksToLocalStorage();
        // console.log(localStorage); << use this if want to check the updated book data

        // Updating the Bookshelf
        updateBookshelf();

        // Input form data resets
        document.getElementById('bookFormTitle').value = '';
        document.getElementById('bookFormAuthor').value = '';
        document.getElementById('bookFormYear').value = '';
        document.getElementById('bookFormIsComplete').checked = false;

    });

    // Function to update the bookshelf interface
    function updateBookshelf() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        for (const book of books) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        }
    }

    // Function to remove books based from ID
    function removeBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    // Function to change the book complete status
    function toggleIsComplete(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    // Handling form submission to search books
    const searchBook = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchBookTitle.value.toLowerCase().trim();

        const searchResults = books.filter(book => {
            return (
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.year.toString().includes(query)
            );
        });
        
        updateSearchResults(searchResults);
    });

    // Function to update the search results
    function updateSearchResults(results) {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        for (const book of results) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        }
    }

    // Function to create book elements inside the list
    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.setAttribute("data-testid", "bookItem");
        bookItem.className = 'book_item';
        bookItem.style.margin = '15px';

        const actionButtons = document.createElement('div');
        actionButtons.setAttribute("data-testid", "actionButtons");
        actionButtons.className = 'action';

        const title = document.createElement('h3');
        title.setAttribute("data-testid", "bookItemTitle");
        title.textContent = book.title;
        title.style.color = '#000';
        title.style.margin = '10px 0';
        title.style.display = 'flex';
        title.style.justifyContent = 'center';
        title.style.fontSize = '20pt';

        const author = document.createElement('p');
        author.setAttribute("data-testid", "bookItemAuthor")
        author.textContent = 'Penulis: ' + book.author;
        author.style.color = '#000';
        author.style.marginBottom = '10px';

        const year = document.createElement('p');
        year.setAttribute("data-testid", "bookItemYear");
        year.textContent = 'Tahun: ' + book.year;
        year.style.color = '#000';
        year.style.marginBottom = '25px';

        const removeButton = createActionButton('Hapus buku', 'red', function () {
            removeBook(book.id);
        });

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createActionButton('Belum selesai dibaca', 'yellow', function () {
                toggleIsComplete(book.id);
            });
        } else {
            toggleButton = createActionButton('Selesai dibaca', 'green', function () {
                toggleIsComplete(book.id);
            });
        }

        // Action button styling
        removeButton.style.borderRadius = '10px';
        removeButton.style.border = '0';
        removeButton.style.backgroundColor = '#F93737';
        removeButton.style.color = 'white';
        removeButton.style.fontWeight = 'bold';

        toggleButton.style.borderRadius = '10px';
        toggleButton.style.border = '0';
        toggleButton.style.backgroundColor = '#8946E8';
        toggleButton.style.color = 'white';
        toggleButton.style.fontWeight = 'bold';

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(removeButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    // Function to create an action button element
    function createActionButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    //Update bookshelf interface when the page loaded.
    updateBookshelf();

});