
/************************
     ADDING TO-DO'S
************************/

// press enter button at end of line to create new todo
$(".to-do-ul").on('keyup', function(e) {
  if (e.keyCode == 13) {
    addInputField();
    createTodo();
  }
});

// clicked [new todo] button
$(".new-todo-link").on('click', function(e) {
  addInputField();
  createTodo();
});

function addInputField() {
  $('.to-do-ul').append(`<div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="">
    </div>`);
  $(".to-do-input:last-of-type").focus();
}

function createTodo() {
  currentListId = document.getElementById('current-list').getAttribute("listid");
  axios.post('/todos', {
    currentListId: currentListId
  }).then(res => {
    // console.log(res);
    todo = res.data;
    $(".to-do-input:last-of-type").attr('todoid', todo._id);
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
      todoId = document.activeElement.getAttribute("todoid");
      console.log('todoId is: ' + todoId);
      deleteTodo(todoId);
      document.activeElement.parentElement.remove();
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
