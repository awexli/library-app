const library = {1: ['George', 'Lucas', 'Read']};
let id = 1;

class Book {
    constructor(id, title, author, status) {
        this.id = id;
        this.title = title
        this.author = author
        this.status = status
    }

    addBookToLibrary() {
        const newBook1 = [this.title, this.author, this.status]
        library[this.id] = newBook1;
    }

    render() {
        renderCard(this.id, library[this.id])
    }
}

const addBook = document.getElementById('submit-book');
addBook.addEventListener('click', () => {
    newBook();
});

function newBook() {
    const addTitle = document.getElementById('title');
    const addAuthor = document.getElementById('author');
    const addStatus = document.getElementById('status');

    const validTitle = isValidString(addTitle);
    const validAuthor = isValidString(addAuthor);
    const statusValue = checkStatus(addStatus);

    if (validTitle && validAuthor) {
        const newBook = new Book
        (   
            ++id,
            addTitle.value, 
            addAuthor.value, 
            statusValue
        );
        newBook.addBookToLibrary();
        newBook.render();
    }
    
    addTitle.value = "";
    addAuthor.value = "";
    addStatus.checked = false;
}

function checkStatus(checkbox) {
    return checkbox.checked ? "Read" : "To Read";
}

function isValidString(input) {
    const alphaExp = /^[a-zA-Z]+$/;
    return input.value.match(alphaExp)
}

function renderAll() {
    for (const [key, value] of Object.entries(library)) {
        renderCard(key, value);
    }
}

// could also be used to refresh
function renderCard(id, index) {
    const newCard = document.createElement('div')
    const bookId = document.createElement('p')
    const renderTitle = document.createElement('p')
    const renderAuthor = document.createElement('p')
    const renderStatus = document.createElement('p')
    const delButton = document.createElement('button');
    bookId.innerText = id;
    renderTitle.innerText = index[0];
    renderAuthor.innerText = index[1];
    renderStatus.innerText = index[2];
    delButton.innerText = "Remove"
    newCard.appendChild(bookId);
    newCard.appendChild(renderTitle)
    newCard.appendChild(renderAuthor)
    newCard.appendChild(renderStatus)
    newCard.appendChild(delButton);
    document.querySelector('.card').appendChild(newCard)
}

window.onload = function() {
    renderAll();
}