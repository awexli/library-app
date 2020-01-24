const library = new Map();
library.set(1,['George', 'Lucas', 'Read'])
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
        library.set(this.id, newBook1);
    }

    render() {
        renderCard(this.id, library.get(this.id))
    }
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'submit-book') newBook();
    if (e.target.className === 'delete') deleteEntry(e);
    console.log(library)
})


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

function deleteEntry(e) {
    const card = e.path[1];
    const bookId = card.id;

    library.delete(parseInt(bookId))
    card.remove();
}

function checkStatus(checkbox) {
    return checkbox.checked ? "Read" : "To Read";
}

function isValidString(input) {
    const alphaExp = /^[a-zA-Z]+$/;
    return input.value.match(alphaExp)
}

function renderAll() {
    const id = library.keys();
    const index = library.values();

    for (let i = 0; i < library.size; i++) {
        renderCard(id.next().value, index.next().value);
    }
}

// could also be used to refresh
function renderCard(id, index) {
    const newCard = document.createElement('div')
    const renderTitle = document.createElement('p')
    const renderAuthor = document.createElement('p')
    const renderStatus = document.createElement('p')
    const delButton = document.createElement('button');

    renderTitle.innerText = index[0];
    renderAuthor.innerText = index[1];
    renderStatus.innerText = index[2];

    delButton.innerText = "Remove";
    delButton.className = "delete";

    newCard.className = "card";
    newCard.id = id;
    
    newCard.appendChild(renderTitle)
    newCard.appendChild(renderAuthor)
    newCard.appendChild(renderStatus)
    newCard.appendChild(delButton);

    document.querySelector('#cards').appendChild(newCard)
}

window.onload = function() {
    renderAll();
}