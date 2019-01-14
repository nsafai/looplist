// Init a timeout variable to be used below
var timeout = null;
var doneTypingDelay = 800;

/************************
     ADDING TO-DO'S
************************/

// press enter button at end of line to create new todo
$(".to-do-ul").on('keyup', function(e) {
  if (e.keyCode == 13) {
    let todoId = document.activeElement.getAttribute("todoid");
    createTodo(todoId);
  }
});

// clicked [new todo] button
$(".new-todo-link").on('click', function(e) {
  createTodo('button');
});

function createTodo(sender) {
  let currentListId = document.getElementById('current-list').getAttribute("listid");
  axios.post('/create-todo', {
    currentListId: currentListId
  }).then(res => {
    const todo = res.data;
    const todoHTML = `<div class="to-do-and-chkbox">
        <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
        <input class='to-do-input' value="" id="${todo._id}"
        todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
      </div>`;
    if (sender == 'button') {
      $('.to-do-ul').append(todoHTML);
    } else {
      // sender contains ID of todo field user pressed ENTER on
      let activeInput = $(`#${sender}`)
      activeInput.parent().after(todoHTML);
    }
    document.getElementById(todo._id).focus();
  }).catch(error => {
    console.error(error);
  });
}

/************************
    REMOVING TO-DO'S
************************/

$(".to-do-ul").on('keyup', function(e) {
  if (document.activeElement.value == "") {
    // todo item is empty, user may be trying to delete that field
    if (e.keyCode == 8) { // someone pressed backspace
      let todoId = document.activeElement.getAttribute("todoid");
      let activeInput = $(`#${todoId}`);
      prevInput = activeInput.parent().prev().find('.to-do-input');
      deleteTodo(todoId);
      document.activeElement.parentElement.remove();
      prevInput.focus().val(prevInput.val());
      // ^ by focusing then resetting value, cursor is at end of text field
    }
  }
});

function deleteTodo(todoId) {
  axios.delete('/delete-todo', {
    params: { id: todoId }
  }).then(res => {
    // window.location = "/lists";
  }).catch(error => {
    console.error(error);
  });
}

/************************
      SAVING TO-DO'S
************************/

function saveTodo(todoId) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
      var todoInputValue = document.getElementById(todoId).value;
      console.log('timer finished! saving now.');
      axios.post('/save-todo', {
        todoId: todoId,
        todoInputValue: todoInputValue
      }).then(res => {
        console.log(res);
      }).catch(error => {
        console.error(error);
      });
    }, doneTypingDelay);
}

/************************
 SELECT/DESELECT CHECKBOX
************************/

function checkbox(todoId) {
  clearTimeout(timeout);
  const todoCheckbox = document.getElementById('chk-' + todoId)
  todoCheckbox.classList.remove('fa-circle');
  todoCheckbox.classList.add('fa-check-circle');
  todoCheckbox.setAttribute("onClick", `uncheckbox('${todoId}')`);
  let completed = todoCheckbox.classList.contains('fa-check-circle');
  timeout = setTimeout(function () {
    toggleCompletion(todoId, completed);
  }, 500);
}

function uncheckbox(todoId) {
  clearTimeout(timeout);
  const todoCheckbox = document.getElementById('chk-' + todoId)
  todoCheckbox.classList.remove('fa-check-circle');
  todoCheckbox.classList.add('fa-circle');
  todoCheckbox.setAttribute("onClick", `checkbox('${todoId}')`);
  let completed = todoCheckbox.classList.contains('fa-check-circle');
  timeout = setTimeout(function () {
    toggleCompletion(todoId, completed);
  }, 50);
}

function toggleCompletion(todoId, completed) {
  axios.post('/toggle-todo', {
    todoId: todoId,
    completed: completed
  }).catch(error => {
    console.error(error);
  });
}

/************************
   RESET ALL CHECKBOXES
************************/
function resetCheckboxes(checklistId) {
  axios.post('/reset-all-todos', {
    checklistId: checklistId
  }).then(res => {
    checkboxes = document.getElementsByClassName('chkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].classList.remove('fa-check-circle');
      checkboxes[i].classList.add('fa-circle');
    }
  }).catch(error => {
    console.error(error);
  });
}
