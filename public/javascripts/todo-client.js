/* eslint-disable newline-per-chained-call */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**********************************************
*         TODO SOCKET "CHECKLIST"
**********************************************/

let createSender = null; // tells us whether button or enter key sent create request
/************************
     CREATE TO-DO'S
************************/
function createTodo(sender) {
  const currentListId = document.getElementById('current-list').getAttribute('listid')
  const activeInput = $(':focus')
  let todoIndex = null;
  if (sender.type === 'keyup') {
    // pressed enter and wants todo right after activeInput
    todoIndex = parseInt(activeInput.attr('todoindex'), 10) + 1
  } else if (sender.type === 'click') {
    // pressed new button and wants todo at bottom
    todoIndex = $('#todos-container')[0].children.length
  }
  console.log(todoIndex);
  socket.emit('create-todo', { currentListId, todoIndex })
}

// on response from server
socket.on('create-todo', (todo) => {
  console.log(todo.index);
  const todoHTML = `
    <div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="" id="${todo._id}" autocomplete="off"
      todoid="${todo._id}" todoIndex=${todo.index} oninput="saveTodo('${todo._id}')">
    </div>`

  if (createSender === 'enter') {
    $(`[todoindex=${todo.index - 1}]`).parent().after(todoHTML);
  } else if (createSender === 'button') {
    $('#todos-container').append(todoHTML);
  }
  document.getElementById(todo._id).focus()
  updateTodoIndices()
})

// press enter button at end of line to create new todo
todosContainer.on('keyup', (e) => {
  if (e.keyCode === 13) {
    createSender = 'enter'
    createTodo(e)
  }
})

// clicked [new todo] button
$('.new-todo-link').on('click', (e) => {
  createSender = 'button'
  createTodo(e)
})

/************************
      SAVE TO-DOS
************************/
function saveTodo(todoId) {
  const todoInput = document.getElementById(todoId)
  const todoInputValue = todoInput.value
  const todoIndex = todoInput.getAttribute('todoindex')
  console.log('saving todo at index', todoIndex)
  socket.emit('save-todo', {
    todoId,
    todoInputValue,
    todoIndex,
  })
}

/************************
     DELETE TO-DO'S
************************/
function deleteTodo(todoId) {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    socket.emit('delete-todo', todoId)
  }, stillEditingDelay)
}

// on server response
socket.on('delete-todo', (todoId) => {
  // bring text cursor to previous input
  const prevInput = $(`#${todoId}`).parent().prev().children('input').first()
  prevInput.focus()
  //  clear the value and then reset to bring cursor to end of input
  const tmpStr = prevInput.val()
  prevInput.val('')
  prevInput.val(tmpStr)
  // delete todo on frontend
  $(`#${todoId}`).parent().remove()
})

// BACKSPACE KEY EVENT LISTENER
$('.to-do-ul').on('keydown', (e) => {
  if (document.activeElement.value === '') {
    // todo item is empty, user may be trying to delete that field
    if (e.keyCode === 8) { // someone pressed backspace
      const todoId = document.activeElement.getAttribute('todoid')
      deleteTodo(todoId)
    }
  }
})

/************************
 SELECT/DESELECT CHECKBOX
************************/
let todosToUpdate = []

function toggleCompletion(todosToUpdate) {
  socket.emit('toggle-todo', todosToUpdate)
}

// on server response
socket.on('toggle-todo', () => {
  todosToUpdate = []
})

// triggered when checking a box
function checkbox(todoId) {
  clearTimeout(timeout)
  const todoCheckbox = document.getElementById(`chk-${todoId}`)
  todoCheckbox.classList.remove('fa-circle')
  todoCheckbox.classList.add('fa-check-circle')
  todoCheckbox.setAttribute('onClick', `uncheckbox('${todoId}')`)
  const completed = todoCheckbox.classList.contains('fa-check-circle')
  todosToUpdate.push({ id: todoId, completed })
  console.log(`todosToUpdate: ${todosToUpdate}`)
  timeout = setTimeout(() => {
    toggleCompletion(todosToUpdate)
  }, stillEditingDelay)
}

// triggered when un-checking a box
function uncheckbox(todoId) {
  clearTimeout(timeout)
  const todoCheckbox = document.getElementById(`chk-${todoId}`)
  // add that id to an array
  todoCheckbox.classList.remove('fa-check-circle')
  todoCheckbox.classList.add('fa-circle')
  todoCheckbox.setAttribute('onClick', `checkbox('${todoId}')`)
  const completed = todoCheckbox.classList.contains('fa-check-circle')
  todosToUpdate.push({ id: todoId, completed })
  console.log(`todosToUpdate: ${todosToUpdate}`)
  timeout = setTimeout(() => {
    toggleCompletion(todosToUpdate)
  }, stillEditingDelay)
}

/************************
   RESET ALL CHECKBOXES
************************/
function resetCheckboxes(checklistId) {
  socket.emit('reset-all-todos', checklistId)
}

// on server response
socket.on('reset-all-todos', () => {
  const checkboxes = document.getElementsByClassName('chkbox')
  for (let i = 0; i < checkboxes.length; i += 1) {
    checkboxes[i].classList.remove('fa-check-circle')
    checkboxes[i].classList.add('fa-circle')
  }
})

/************************
   UPDATE TODO INDICES
************************/
function updateTodoIndices() {
  // TODO: only update after todos after todoIndex
  const todos = $('#todos-container')[0].children
  const numTodos = todos.length
  console.log('there are', numTodos, 'todos in the list')
  for (let idx = 0; idx < numTodos; idx += 1) {
    todoInput = $(todos[idx]).children('input')
    todoId = todoInput.attr('id')
    todoInput.attr('todoindex', idx)
    saveTodo(todoId)
  }
}
