/**********************************************
*         CLIENT SOCKET "CHECKLIST"         
**********************************************/
// socket setup
const socket = io.connect();

// only fire requests once every 200 ms, timeout resets on every edit
var timeout = null;
var stillEditingDelay = 200;

// set first list as selected by default
$('#ul-of-list-names li:first').addClass('selected-list');

// get references to some HTML elements
const listsContainer = $('#ul-of-list-names');
const todosContainer = $('#todos-container');
const listTitleContainer = $('#list-title-container');
const listViewContainer = $('#list-items-view');
const listViewHelperText = $('#select-a-list-helper-div');

/***********************
*     GET LIST        
***********************/

function getListItems(listId) {
  listViewHelperText.addClass('hidden');
  const oldCurrentList = $(`.selected-list`)[0];
  if (oldCurrentList) { 
    // have to check this because there are no selected lists on search
    oldCurrentList.classList.remove('selected-list');
  }
  const newCurrentList = $(`#${listId}`);
  newCurrentList.addClass('selected-list');
  socket.emit('get-list', listId);
}

socket.on('get-list', (listData) => {
  console.log(listData);
  const { currentList, currentListTodos } = listData;
  listTitleContainer.empty();
  listTitleContainer.append(`
    <input id="current-list" listid="${currentList._id}"
    value="${currentList.title}" placeholder="List Name"
    oninput="saveListName('${currentList._id}')"></input>
  `);
  todosContainer.empty();
  currentListTodos.forEach(function(todo) {
    if (todo.completed) {
      todosContainer.append(`
      <div class="to-do-and-chkbox">
        <a class="chkbox far fa-check-circle" id="chk-${todo._id}"
        onClick="uncheckbox('${todo._id}')" tabindex="-1"></a>
        <input class='to-do-input' value="${todo.name}" id="${todo._id}"
        todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
      </div>
      `);
    } else {
    todosContainer.append(`
      <div class="to-do-and-chkbox">
        <a class="chkbox far fa-circle" id="chk-${todo._id}"
        onClick="checkbox('${todo._id}')" tabindex="-1"></a>
        <input class='to-do-input' value="${todo.name}" id="${todo._id}"
        todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
      </div>
    `)
    }
  })
})

/************************
      CREATE LIST
************************/

function createList(currentUserId) {
  console.log('user trying to create list', currentUserId);
  // send request to server
  socket.emit('new-list', currentUserId);
}

// on response from server
socket.on('new-list', (listData) => {
  const prevSelected = $('.selected-list')[0];
  list = listData;
  listsContainer.prepend(`
    <a onclick="getListItems('${list._id}')">
      <li class="left-list-name selected-list" id="${list._id}">${list.title}</li>
    </a>
  `);
  if (prevSelected) { // nil check
    prevSelected.classList.remove("selected-list");
  }
  getListItems(list._id);
})

/************************
     REMOVING LISTS
************************/
function deleteList(listId) {
  socket.emit('delete-list', listId);
}

// on response from server
socket.on('delete-list', (listId) => {
  console.log('list', listId, ' was successfully deleted')
  window.location = "/lists";
})

/************************
     SAVING LIST NAME
************************/
function saveListName(currentListId) {
  clearTimeout(timeout);
  var listNameInputValue = document.getElementById('current-list').value;
  // update list title inside left pane on each key stroke
  var listNameLeftPane = document.getElementById(currentListId);
  listNameLeftPane.innerHTML = listNameInputValue;
  
  timeout = setTimeout(function () {
    socket.emit('save-list-name', {
      currentListId: currentListId,
      newListName: listNameInputValue
    })
  }, stillEditingDelay);
}

/************************
      SEARCH LISTS
************************/
function search() {
  const currentUserId = $('#user-id').val();
  const searchTerm = $('#search-lists-input').val();
  console.log('searching for', searchTerm);
  socket.emit('search', { 
    searchTerm, 
    currentUserId,
  });
}

// BUTTON AND KEYBOARD LISTENERS
$('#search-lists-input').on('input', function(event) {
  timeout = setTimeout(function () {
    search();
  }, stillEditingDelay);
})

$('#search-lists-btn').click(function(event) {
  event.preventDefault();
  search();
})

// on response from server
socket.on('search', (results) => {
  const currentListId = $(`#current-list`).attr("listid");
  const { lists, searchTerm } = results;

  listsContainer.empty();
  
  if (lists.length === 0) {
    listsContainer.append(`
      <li class="search-results-txt">No results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
    `);
  } else {
    if (searchTerm) {
      listsContainer.append(`
        <li class="search-results-txt">Showing results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
      `);
    }
    lists.forEach(function(list) {
      if (list._id === currentListId) {
        listsContainer.append(`
        <a onclick="getListItems('${list._id}')">
          <li class="left-list-name selected-list" id="${list._id}">${list.title}</li>
        </a>
      `);
      } else {
        listsContainer.append(`
        <a onclick="getListItems('${list._id}')">
          <li class="left-list-name" id="${list._id}">${list.title}</li>
        </a>
      `);
      }
    });
  }
})
