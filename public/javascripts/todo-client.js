/**********************************************
*         TODO SOCKET "CHECKLIST"         
**********************************************/
// socket setup
// const socket = io.connect();

// only fire requests once every 200 ms, timeout resets on every edit
var timeout = null;
var stillEditingDelay = 200;

/************************
     ADDING TO-DO'S
************************/
function createTodo(sender) {
  let currentListId = document.getElementById('current-list').getAttribute("listid");
  socket.emit('create-todo', currentListId, sender);
}

// on response from server
socket.on('create-todo', (response) => {
  const { todo, sender } = response;
  console.log('successfully created new todo with ID: ' + todo._id);
  const todoHTML = `<div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="" id="${todo._id}"
      todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
    </div>`;
  if (sender == 'button') {
    $('.to-do-ul').append(todoHTML);
  } else {
    // sender contains ID of todo field user pressed ENTER on
    const activeInput = $(`#${sender}`)
    activeInput.parent().after(todoHTML);
  }
  document.getElementById(todo._id).focus();
})

// press enter button at end of line to create new todo
$(".to-do-ul").on('keyup', function(e) {
  if (e.keyCode == 13) {
    const todoId = document.activeElement.getAttribute("todoid");
    // createTodo(todoId);
    createTodo('button');
  }
});

// clicked [new todo] button
$(".new-todo-link").on('click', function(e) {
  createTodo('button');
});