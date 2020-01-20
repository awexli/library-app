const myLibrary = [['george','lucas','read']]

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
    }

    render() {
        renderCard(myLibrary.length-1);
    }
}

const addBook = document.getElementById('add')
addBook.addEventListener('click', () => {
    const newBook = new Book('a', 'b', 'c');
    newBook.addBookToLibrary();
    newBook.render();
    console.log(myLibrary)
})

function initialRender() {
    for(let i = 0; i < myLibrary.length; i++) {
        renderCard(i);
    }
}

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