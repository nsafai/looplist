/**********************************************
*         CLIENT SOCKET "CHECKLIST"         
**********************************************/
const socket = io.connect();

// var timeout = null;
// var stillEditingDelay = 800;

// /************************
// * SETUP/SELECT TOP LIST *
// ************************/

// $('#ul-of-list-names li:first').addClass('selected-list');
// const listsContainer = $('#ul-of-list-names');
// const todosContainer = $('#todos-container');
// const listTitleContainer = $('#list-title-container');
// const listViewContainer = $('#list-items-view');
// const listViewHelperText = $('#select-a-list-helper-div');

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
     CREATE NEW LIST
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
