let lib = {1:['Dune', 'Frank Herbert', 'Read']}
let id = 1;
let hasLocal = false;

class Book {
    constructor(id, title, author, status) {
        this.id = id;
        this.title = title
        this.author = author
        this.status = status
    }

    addBookToLibrary() {
        const newBook1 = [this.title, this.author, this.status]

        if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

        lib[this.id] = newBook1;

        localStorage.setItem('lib', JSON.stringify(lib));

        console.log(lib)
    }

    render() {
        if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

        renderCard(this.id, lib[this.id]);
    }
}

function listen() {
    var currCard, currId;
    document.addEventListener('click', (e) => {
        const card = e.path[2];
        const bookId = parseInt(card.id);

        if (e.target.id == 'submit-book') newBook();

        if (e.target.className == 'delete') deleteEntry(card, bookId);

        if (e.target.className == 'edit-card') {
            currId = bookId;
            currCard = card;
            enterEditModal(currId, currCard, false)
        }

        if (e.target.id == 'confirm-edit') enterEditModal(currId, currCard, true);

        if (e.target.id == 'sort-title') sortTable(0);

        if (e.target.id == 'sort-author') sortTable(1);
        
        if (e.target.id == 'sort-status') sortTable(2);
    })
} 

function newBook() {
    const addTitle = document.getElementById('title');
    const addAuthor = document.getElementById('author');
    const addStatus = document.getElementById('status');

    const validTitle = isValidString(addTitle);
    const validAuthor = isValidString(addAuthor);
    const statusValue = checkStatus(addStatus);

    if (hasLocal) id = localStorage.getItem('id');

    if (validTitle && validAuthor) {
        const newBook = new Book
        (   
            ++id,
            addTitle.value, 
            addAuthor.value, 
            statusValue
        );
        localStorage.setItem('id', id);
        newBook.addBookToLibrary();
        newBook.render();
    } else {
        // display error message
        console.log('Did not update because not alphabet')
    }
    
    addTitle.value = "";
    addAuthor.value = "";
    addStatus.checked = false;
}

function deleteEntry(card, bookId) {
    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

    delete lib[bookId];

    card.remove();

    localStorage.setItem('lib', JSON.stringify(lib));
}

/**
 * @param {number} bookId
 * @param {HTMLTableRowElement} card
 * @param {boolean} isConfirm
 * @return {function} isConfirm ? confirmEdit() : editModal();
 */
function enterEditModal(bookId, card, isConfirm) {
    const editTitle = document.getElementById('title-edit');
    const editAuthor = document.getElementById('author-edit');
    const editStatus = document.getElementById('status-edit');

    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

    const editModal = () => {
        var bookDataArray;

        bookDataArray = lib[bookId];

        editTitle.value = bookDataArray[0];
        editAuthor.value = bookDataArray[1];

        if (bookDataArray[2] == 'Read') {
            editStatus.checked = true;
        } else {
            editStatus.checked = false;
        }
    }

    const confirmEdit = () => {
        const validTitle = isValidString(editTitle);
        const validAuthor = isValidString(editAuthor);
        const statusValue = checkStatus(editStatus);

        if (validTitle && validAuthor) {

            lib[bookId] = [
                editTitle.value,
                editAuthor.value,
                statusValue
            ];

            localStorage.setItem('lib', JSON.stringify(lib));

            updateCard(bookId, card);
        } else {
            // display error message
            console.log('Did not update because not alphabet')
        }

        editTitle.value = "";
        editAuthor.value = "";
    }

    return isConfirm ? confirmEdit() : editModal();
}

/**
 * Updates the innerText of title, author, and status in a card-row
 * @param {number} bookId
 * @param {HTMLTableRowElement} card
 * @return {void}
 */
function updateCard(bookId, card) {
    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));
        
    var bookData = lib[bookId]

    for (let i = 0; i < bookData.length; i++) {
        let stringEntry = `{ "update":"${bookData[i]}" }`;
        let entry = JSON.parse(stringEntry);
        card.children[i].innerText = entry.update;
    }
    
}

function checkStatus(checkbox) {
    return checkbox.checked ? "Read" : "To Read";
}

function isValidString(input) {
    const alphaExp = /^[\sa-zA-Z]+$/;
    return input.value.match(alphaExp)
}

function renderAll(hasLocal) {
    var id, index, length;

    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));
        
    id = Object.keys(lib);
    index = Object.values(lib);
    length = Object.keys(lib).length;

    for (let i = 0; i < length; i++) {
        renderCard(id[i], index[i]);
    }
}

function renderCard(key, value){
    const cards = document.getElementById('cards');
    let cardTemplate = `
    <tr id="${key}" class="card-row">
        <td class="title">${value[0]}</td>
        <td class="author">${value[1]}</td>
        <td class="status">${value[2]}</td>
        <td class="wrap-buttons">
            <button class="edit-card" data-toggle="modal" data-target="#editBookModal">Edit</button>
            <button class="delete">Remove</button>
        </td>
    </tr>
    `;
    cards.innerHTML = cards.innerHTML + cardTemplate;
}

window.onload = function() {
    this.listen();
    if (storageAvailable('localStorage')) {
        console.log('Yippee! We can use localStorage awesomeness')
        hasLocal = true;
        if (!localStorage.getItem('lib')) {
            localStorage.setItem('lib', JSON.stringify(lib));
            localStorage.setItem('id', id);
            this.renderAll(hasLocal);
        } else {
            this.renderAll(hasLocal);
        }
    } else {
        console.log('Too bad, no localStorage for us')
        this.renderAll(hasLocal);
    }
}

// w3school
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("card-table");
    switching = true;
    dir = "asc"; 
    while (switching) {
        switching = false;
        rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
            }
        } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
    }
    if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;      
    } else {
            if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
            }
        }
    }
}
// MDN  web docs
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}