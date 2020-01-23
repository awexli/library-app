const myLibrary = [['george','lucas','read']]
const addBook = document.getElementById('submit-book');

class Book {
    constructor(title, author, status) {
        // TODO
        this.title = title
        this.author = author
        this.status = status
    }

    addBookToLibrary() {
        const newBook = [this.title, this.author, this.status];
        myLibrary.push(newBook)
        console.log(myLibrary)
    }

    render() {
        renderCard(myLibrary.length-1);
    }
}

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
        (   addTitle.value, 
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

function initialRender() {
    for(let i = 0; i < myLibrary.length; i++) {
        renderCard(i);
    }
}

// could also be used to refresh
function renderCard(index) {
    const newCard = document.createElement('div')
    const renderTitle = document.createElement('P')
    const renderAuthor = document.createElement('P')
    const renderStatus = document.createElement('P')
    renderTitle.innerText = myLibrary[index][0]
    renderAuthor.innerText = myLibrary[index][1]
    renderStatus.innerText = myLibrary[index][2]
    newCard.appendChild(renderTitle)
    newCard.appendChild(renderAuthor)
    newCard.appendChild(renderStatus)
    document.querySelector('.card').appendChild(newCard)
}

window.onload = function() {
    initialRender();
}