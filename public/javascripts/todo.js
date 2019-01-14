
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
  axios.post('/todos', {
    currentListId: currentListId
  }).then(res => {
    const todo = res.data;
    const todoHTML = `<div class="to-do-and-chkbox">
        <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
        <input class='to-do-input' value="" id="${todo._id}"
        todoid="${todo._id}" oninput="setTimeout(saveTodo('{{todo._id}}'), 500)">
      </div>`
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
  if (e.keyCode == 8) {
    // someone pressed backspace
    if (document.activeElement.value == "") {
      // todo item is empty, user is trying to delete that field
      let todoId = document.activeElement.getAttribute("todoid");
      let activeInput = $(`#${todoId}`);
      console.log(activeInput.parent().prev().find('.to-do-input'));
      // activeInput = document.activeElement;
      // todoId = activeInput.getAttribute("todoid");
      prevInput = activeInput.parent().prev().find('.to-do-input');
      // activeInput.closest('.to-do-and-chkbox').prev('.to-do-input').find('.to-do-input');
      // activeInput.parent().prev('.to-do-and-chkbox').focus();
      deleteTodo(todoId);
      document.activeElement.parentElement.remove();
      prevInput.focus().val(prevInput.val());
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
  var todoInputValue = document.getElementById(todoId).value;
  axios.post('/save-todo', {
    todoId: todoId,
    todoInputValue: todoInputValue
  }).then(res => {
    console.log(res);
  }).catch(error => {
    console.error(error);
  });
}

/************************
 SELECT/DESELECT CHECKBOX
************************/
function checkbox(todoId) {
  const todoCheckbox = document.getElementById('chk-' + todoId)
  todoCheckbox.classList.remove('fa-circle');
  todoCheckbox.classList.add('fa-check-circle');
  todoCheckbox.setAttribute("onClick", `uncheckbox('${todoId}')`);
  toggleCompletion(todoId);
}

function uncheckbox(todoId) {
  const todoCheckbox = document.getElementById('chk-' + todoId)
  todoCheckbox.classList.remove('fa-check-circle');
  todoCheckbox.classList.add('fa-circle');
  todoCheckbox.setAttribute("onClick", `checkbox('${todoId}')`);
  toggleCompletion(todoId);
}

function toggleCompletion(todoId) {
  axios.post('/toggle-todo', {
    todoId: todoId
  }).catch(error => {
    console.error(error);
  });
}
