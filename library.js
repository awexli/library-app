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

function listen() {
    let currCard;
    let currId;
    document.addEventListener('click', (e) => {
        const card = e.path[1];
        const bookId = parseInt(card.id);
    
        if (e.target.id == 'submit-book') newBook();
        if (e.target.className == 'delete') deleteEntry(card, bookId);
        if (e.target.className == 'edit-card') {
            currCard = card;
            currId = bookId;
            editModal(currId);
        }
        if (e.target.id == 'confirm-edit') editEntry(currId, currCard);
    })
} 

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

function deleteEntry(card, bookId) {
    library.delete(bookId)
    card.remove();
}

function editModal(bookId) {
    const bookData = library.get(bookId);
    const editTitle = document.getElementById('title-edit');
    const editAuthor = document.getElementById('author-edit');
    const editStatus = document.getElementById('status-edit');

    editTitle.placeholder = bookData[0];
    editAuthor.placeholder = bookData[1];

    if (bookData[2] == 'Read') {
        editStatus.checked = true;
    } else {
        editStatus.checked = false;
    }
}

function editEntry(bookId, card) {
    const editTitle = document.getElementById('title-edit');
    const editAuthor = document.getElementById('author-edit');
    const editStatus = document.getElementById('status');

    const validTitle = isValidString(editTitle);
    const validAuthor = isValidString(editAuthor);
    const statusValue = checkStatus(editStatus);

    if (validTitle && validAuthor) {
        library.set(bookId,[
            editTitle.value,
            editAuthor.value,
            statusValue
        ]);
    }

    // rerender entry
    // could also be used to refresh
    const bookData = library.get(bookId);
    if (card.hasChildNodes()) {
        const children = card.childNodes;
        for (let i = 0; i < 3; i++) {
            children[i].innerText = bookData[i];
        }
    }
    
    editTitle.value = "";
    editAuthor.value = "";
    statusValue.checked = false;
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

function renderCard(id, index) {
    const newCard = document.createElement('div')
    const renderTitle = document.createElement('p')
    const renderAuthor = document.createElement('p')
    const renderStatus = document.createElement('p')
    const delButton = document.createElement('button');
    const editCard = document.createElement('button');

    renderTitle.className ='title';
    renderTitle.innerText = index[0];

    renderAuthor.className = 'author';
    renderAuthor.innerText = index[1];

    renderStatus.className = 'status';
    renderStatus.innerText = index[2];

    delButton.innerText = "Remove";
    delButton.className = "delete";

    editCard.innerText = "Edit";
    editCard.className = "edit-card";
    editCard.setAttribute('data-toggle', 'modal');
    editCard.setAttribute('data-target', '#editBookModal');

    newCard.className = "card";
    newCard.id = id;
    
    newCard.appendChild(renderTitle)
    newCard.appendChild(renderAuthor)
    newCard.appendChild(renderStatus)
    newCard.appendChild(editCard);
    newCard.appendChild(delButton);

    document.querySelector('#cards').appendChild(newCard)
}

window.onload = function() {
    this.renderAll();
    this.listen();
}