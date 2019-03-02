/************************
    REMOVING TO-DO'S
************************/

$(".to-do-ul").on('keyup', function(e) {
  if (document.activeElement.value == "") {
    // todo item is empty, user may be trying to delete that field
    if (e.keyCode == 8) { // someone pressed backspace
      const todoId = document.activeElement.getAttribute("todoid");
      const activeInput = $(`#${todoId}`);
      const prevInput = activeInput.parent().prev().find('.to-do-input');
      deleteTodo(todoId, activeInput, prevInput);
    }
  }
});

function deleteTodo(todoId, activeInput, prevInput) {
  axios.delete('/delete-todo', {
    params: { id: todoId }
  }).then(res => {
    console.log(res.data);
    activeInput.parent().remove();
    // prevInput.focus().val(prevInput.val());
    var prevInputLength= prevInput.val().length;
    prevInput.focus();
    prevInput[0].setSelectionRange(prevInputLength, prevInputLength);
    // ^ by focusing then resetting value, cursor is at end of text field
  }).catch(error => {
    console.error(error);
  });
}

// /************************
//       SAVING TO-DO'S
// ************************/

// function saveTodo(todoId) {
//   clearTimeout(timeout);
//   timeout = setTimeout(function () {
//       var todoInputValue = document.getElementById(todoId).value;
//       console.log('timer finished! saving now.');
//       axios.post('/save-todo', {
//         todoId: todoId,
//         todoInputValue: todoInputValue
//       }).then(res => {
//         console.log(res);
//       }).catch(error => {
//         console.error(error);
//       });
//     }, stillEditingDelay);
// }

/************************
 SELECT/DESELECT CHECKBOX
************************/
let todosToUpdate = [];

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

function toggleCompletion(todosToUpdate) {
  console.log('toggling todo - before axios request');
  // display progress spinner
  axios.post('/toggle-todo', {
    todosToUpdate
  }).then((res) => {
    // hide progress spinner
    console.log(res.data);
    todosToUpdate = [];
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
    let checkboxes = document.getElementsByClassName('chkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].classList.remove('fa-check-circle');
      checkboxes[i].classList.add('fa-circle');
    }
  }).catch(error => {
    console.error(error);
  });
}
