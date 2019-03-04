/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**********************************************
*         TODO SOCKET "CHECKLIST"
**********************************************/
// socket setup
// const socket = io.connect()

/************************
     CREATE TO-DO'S
************************/
function createTodo() {
  const currentListId = document.getElementById('current-list').getAttribute('listid')
  socket.emit('create-todo', currentListId)
}

// on response from server
socket.on('create-todo', (todoId) => {
  const todoHTML = `
    <div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="" id="${todoId}" autocomplete="off"
      todoid="${todoId}" oninput="saveTodo('${todoId}')">
    </div>`
  todosContainer.append(todoHTML)
  document.getElementById(todoId).focus()
})

// press enter button at end of line to create new todo
todosContainer.on('keyup', (e) => {
  if (e.keyCode === 13) {
    createTodo()
  }
})

// clicked [new todo] button
$('.new-todo-link').on('click', () => {
  createTodo()
})

/************************
      SAVE TO-DOS
************************/
function saveTodo(todoId) {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const todoInputValue = document.getElementById(todoId).value
    socket.emit('save-todo', {
      todoId,
      todoInputValue,
    })
  }, stillEditingDelay)
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
  const prevInput = $(`#${todoId}`).parent().prev().children('input')
    .first()
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
