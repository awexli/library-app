var lib = {1:['Dune', 'Frank Herbert', 'Read']};
var id = 1;
var hasLocal = false;
var validInputInterval;

class Book {
    constructor(id, title, author, status) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.status = status;
    }

    addBookToLibrary() {
        const newBook1 = [this.title, this.author, this.status];

        if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

        lib[this.id] = newBook1;

        localStorage.setItem('lib', JSON.stringify(lib));
    }

    render() {
        if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

        renderCard(this.id, lib[this.id]);
    }
}

function listen() {
    var currCard, currId;
    document.addEventListener('click', (e) => {
        var card;
        var bookId;
        try {
            card = e.target.parentElement.parentElement;
            bookId = parseInt(card.id);
          } catch(err) {
            console.log('hiccup!');
        }

        if (e.target.className == 'add-button') {
            currId = bookId;
            currCard = card;
            newBook(false);
        } 

        if (e.target.id == 'submit-book') {
            newBook(true);
        } 

        if (e.target.className == 'edit-card') {
            currId = bookId;
            currCard = card;
            enterEditModal(currId, currCard, false);
        }

        if (e.target.id == 'confirm-edit') {
            enterEditModal(currId, currCard, true);
        } 

        if (e.target.className == 'delete') deleteEntry(card, bookId);

        if (e.target.id == 'sort-title') sortTable(0);

        if (e.target.id == 'sort-author') sortTable(1);
        
        if (e.target.id == 'sort-status') sortTable(2);

    });
} 

/**
 * Checks for valid inputs if addBookModal is entered
 * Add's book to library if valid submission
 * @param {boolean} isSubmit
 * @return {function} isSubmit ? submitBook() : addingBook();
 */
function newBook(isSubmit) {
    const addTitle = document.getElementById('title');
    const addAuthor = document.getElementById('author');
    const addStatus = document.getElementById('status');

    var isValid = false;

    if (hasLocal) id = localStorage.getItem('id');
    
    const addingBook = () => {
        inputFeedback(addTitle, addAuthor, document.getElementById('confirm-edit'));
    };

    const submitBook = () => {
        const err = document.getElementById('error-add');
        const validEntry = document.getElementById('valid-add');
        const validTitle = isValidString(addTitle.value);
        const validAuthor = isValidString(addAuthor.value);
        const statusValue = checkStatus(addStatus);

        if (validTitle && validAuthor) {
            isValid = true;
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
            err.style.display = 'none';
            validEntry.style.display = 'block';
        } else {
            // display error message (only allows alphabet and numbers for now)
            validEntry.style.display = 'none';
            err.style.display = 'block';
        }
    
        if (isValid) {
            addTitle.value = "";
            addAuthor.value = "";
            addStatus.checked = false;
        }
    };
    
    return isSubmit ? submitBook() : addingBook();
}

/**
 * Checks for valid inputs if editBookModal is entered
 * Updates book in the library if valid submission
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
        const dismissModal = document.getElementById('confirm-edit');
        var bookDataArray = lib[bookId];

        editTitle.value = bookDataArray[0];
        editAuthor.value = bookDataArray[1];

        if (bookDataArray[2] == 'Read') {
            editStatus.checked = true;
        } else {
            editStatus.checked = false;
        }

        inputFeedback(editTitle, editAuthor, dismissModal);
    };

    const confirmEdit = () => {
        const validTitle = isValidString(editTitle.value);
        const validAuthor = isValidString(editAuthor.value);
        const statusValue = checkStatus(editStatus);
        const err = document.getElementById('error-confirm');

        if (validTitle && validAuthor) {
            lib[bookId] = [
                editTitle.value,
                editAuthor.value,
                statusValue
            ];

            localStorage.setItem('lib', JSON.stringify(lib));
            updateCard(bookId, card);
        } else {
            // display error message (only allows alphabet and numbers for now)
            err.style.display = 'block';
        }
    };
    
    return isConfirm ? confirmEdit() : editModal();
}

/**
 * Continually checks if input is a valid
 * @param {HTMLInputElement} title
 * @param {HTMLInputElement} author
 * @param {HTMLButtonElement} modal
 * @return {void}
 */
function inputFeedback(title, author, modal) {
    var validEntry = document.getElementById('valid-add');
    var errConfirm = document.getElementById('error-confirm');
    var errAdd = document.getElementById('error-add');
    var modals = document.querySelectorAll('.modal');

    validInputInterval = setInterval(() => {
        if (!isValidString(title.value)) {
            modal.removeAttribute('data-dismiss');
            title.style.backgroundSize = "1rem";
            title.style.borderColor = "red";
        } 
        
        if (!isValidString(author.value)) {
            modal.removeAttribute('data-dismiss');
            author.style.backgroundSize = "1rem";
            author.style.borderColor = "red";
        } 
        
        if (isValidString(title.value)) {
            title.style.backgroundSize = "0";
            title.style.borderColor = "#CED4DA";
        }

        if (isValidString(author.value)) {
            author.style.backgroundSize = "0";
            author.style.borderColor = "#CED4DA";
        }

        if (isValidString(title.value) && isValidString(author.value)) {
            modal.setAttribute('data-dismiss', 'modal');
        }

        // stops interval if modals are closed
        modals.forEach(modal => {
            if (modal.style.display == 'none') {
                validEntry.style.display = 'none';
                errConfirm.style.display = 'none';
                errAdd.style.display = 'none';
                title.value = "";
                author.value = "";
                stopInputFeedBack();
            }
        });
    }, 400);
}

/**
 * Updates the innerText of title, author, and status in a card-row
 * @param {number} bookId
 * @param {HTMLTableRowElement} card
 * @return {void}
 */
function updateCard(bookId, card) {
    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));
        
    var bookData = lib[bookId];

    for (let i = 0; i < bookData.length; i++) {
        let stringEntry = `{ "update":"${bookData[i]}" }`;
        let entry = JSON.parse(stringEntry);
        card.children[i].innerText = entry.update;
    }
    
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

function deleteEntry(card, bookId) {
    if (hasLocal) lib = JSON.parse(localStorage.getItem('lib'));

    delete lib[bookId];

    card.remove();

    localStorage.setItem('lib', JSON.stringify(lib));
}

function checkStatus(checkbox) {
    return checkbox.checked ? "Read" : "To Read";
}

/**
 * Checks for letters, numbers, and whitespace
 * @return {void}
 */
function isValidString(input) {
    const alphaExp = /^[\sa-zA-Z0-9]+$/;
    return alphaExp.test(input);
}

function stopInputFeedBack() {
    clearInterval(validInputInterval);
}

window.onload = function() {
    listen();
    if (storageAvailable('localStorage')) {
        console.log('Yippee! We can use localStorage awesomeness');
        hasLocal = true;
        if (!localStorage.getItem('lib')) {
            localStorage.setItem('lib', JSON.stringify(lib));
            localStorage.setItem('id', id);
            renderAll(hasLocal);
        } else {
            renderAll(hasLocal);
        }
    } else {
        console.log('Too bad, no localStorage for us');
        renderAll(hasLocal);
    }
};

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