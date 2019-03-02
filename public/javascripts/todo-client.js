/**********************************************
*         TODO SOCKET "CHECKLIST"         
**********************************************/
// socket setup
// const socket = io.connect();

// only fire requests once every 200 ms, timeout resets on every edit
var timeout = null;
var stillEditingDelay = 200;

/************************
     CREATE TO-DO'S
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

/************************
      SAVE TO-DOS
************************/
function saveTodo(todoId) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    var todoInputValue = document.getElementById(todoId).value;
    console.log('timer finished! saving now.');
    socket.emit('save-todo', {
      todoId: todoId,
      todoInputValue: todoInputValue
    })
  }, stillEditingDelay);
}

/************************
     DELETE TO-DO'S
************************/
function deleteTodo(todoId) {
  socket.emit('delete-todo', todoId);
}

// on server response
socket.on('delete-todo', (todoId) => {
  console.log('todo item with id:', todoId, 'was successfully deleted');
  // bring text cursor to previous input
  const prevInput = $(`#${todoId}`).parent().prev().children('input').first();
  prevInput.focus()
  //  clear the value and then reset to bring cursor to end of input
  var tmpStr = prevInput.val();
  prevInput.val('');
  prevInput.val(tmpStr);
  // delete todo on frontend
  $(`#${todoId}`).parent().remove();
})

// BACKSPACE KEY EVENT LISTENER
$(".to-do-ul").on('keydown', function(e) {
  console.log(document.activeElement.value);
  if (document.activeElement.value == "") {
    // todo item is empty, user may be trying to delete that field
    if (e.keyCode == 8) { // someone pressed backspace
      const todoId = document.activeElement.getAttribute("todoid");
      deleteTodo(todoId);
    }
  }
});

/************************
 SELECT/DESELECT CHECKBOX
************************/
let todosToUpdate = [];

function toggleCompletion(todosToUpdate) {
  socket.emit('toggle-todo', todosToUpdate);
}

// on server response
socket.on('toggle-todo', () => {
  todosToUpdate = [];
})

// triggered when checking a box
function checkbox(todoId) {
  clearTimeout(timeout);
  const todoCheckbox = document.getElementById('chk-' + todoId)
  todoCheckbox.classList.remove('fa-circle');
  todoCheckbox.classList.add('fa-check-circle');
  todoCheckbox.setAttribute("onClick", `uncheckbox('${todoId}')`);
  const completed = todoCheckbox.classList.contains('fa-check-circle');
  todosToUpdate.push({ id: todoId, completed: completed });
  console.log("todosToUpdate: " + todosToUpdate);
  timeout = setTimeout(function () {
    toggleCompletion(todosToUpdate);
  }, stillEditingDelay);
}

// triggered when un-checking a box
function uncheckbox(todoId) {
  clearTimeout(timeout);
  const todoCheckbox = document.getElementById('chk-' + todoId)
  // add that id to an array
  todoCheckbox.classList.remove('fa-check-circle');
  todoCheckbox.classList.add('fa-circle');
  todoCheckbox.setAttribute("onClick", `checkbox('${todoId}')`);
  const completed = todoCheckbox.classList.contains('fa-check-circle');
  todosToUpdate.push({ id: todoId, completed: completed });
  console.log("todosToUpdate: " + todosToUpdate);
  timeout = setTimeout(function () {
    toggleCompletion(todosToUpdate);
  }, stillEditingDelay);
}

/************************
   RESET ALL CHECKBOXES
************************/
function resetCheckboxes(checklistId) {
  socket.emit('reset-all-todos', checklistId);
}

// on server response
socket.on('reset-all-todos', () => {
  console.log('todos were reset');
  let checkboxes = document.getElementsByClassName('chkbox');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].classList.remove('fa-check-circle');
    checkboxes[i].classList.add('fa-circle');
  }
})