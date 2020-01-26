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
    let currCard, currId;
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
    } else {
        // display error message
        console.log('Did not update because not alphabet')
    }
    
    addTitle.value = "";
    addAuthor.value = "";
    addStatus.checked = false;
}

function deleteEntry(card, bookId) {
    library.delete(bookId)
    card.remove();
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

    const editModal = () => {
        const bookDataArray = library.get(bookId);
        editTitle.placeholder = bookDataArray[0];
        editAuthor.placeholder = bookDataArray[1];

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
            library.set(bookId,[
                editTitle.value,
                editAuthor.value,
                statusValue
            ]);
        } else {
            // display error message
            console.log('Did not update because not alphabet')
        }

        updateCard(bookId, card);
    
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
    const bookData = library.get(bookId);
    if (card.childElementCount > 0) {
        /**
         * mainElements include:
         * <td class="title"></td>
         * <td class="author"></td>
         * <td class="status"></td>
         */
        const mainElements = card.childElementCount - 1;
        for (let i = 0; i < mainElements; i++) {
            card.children[i].innerText = bookData[i];
        }
    }
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
    const cards = document.getElementById('cards');
    let cardTemplate = `
    <tr id="${id}" class="card-row">
        <td class="title">${index[0]}</td>
        <td class="author">${index[1]}</td>
        <td class="status">${index[2]}</td>
        <td class="wrap-buttons">
            <button class="edit-card" data-toggle="modal" data-target="#editBookModal">Edit</button>
            <button class="delete">Remove</button>
        </td>
    </tr>
    `;

    /**
     * This is for cleaning the nodelist of a card's childNodes
     * Prob uncessary cause updateCard() is using HTMLCollection to grab
     * the correct children.
     * Otherwise card.childNodes will include empty #texts nodes
     */
    const trimTemplate = () => {
        const cleanTemplate = []

        cardTemplate.split('\n').map(element => {
            if (element.replace(/\s/g,"") != "") {
                cleanTemplate.push(element.trim());
            } 
        });

        return cleanTemplate.join('');
    }

    cards.innerHTML = cards.innerHTML + cardTemplate;
    console.log(library)
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("card-table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;      
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

window.onload = function() {
    this.renderAll();
    this.listen();
}