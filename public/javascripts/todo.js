// /************************
//  SELECT/DESELECT CHECKBOX
// ************************/
// let todosToUpdate = [];

// function checkbox(todoId) {
//   clearTimeout(timeout);
//   const todoCheckbox = document.getElementById('chk-' + todoId)
//   todoCheckbox.classList.remove('fa-circle');
//   todoCheckbox.classList.add('fa-check-circle');
//   todoCheckbox.setAttribute("onClick", `uncheckbox('${todoId}')`);
//   const completed = todoCheckbox.classList.contains('fa-check-circle');
//   todosToUpdate.push({ id: todoId, completed: completed });
//   console.log("todosToUpdate: " + todosToUpdate);
//   timeout = setTimeout(function () {
//     toggleCompletion(todosToUpdate);
//   }, stillEditingDelay);
// }

// function uncheckbox(todoId) {
//   clearTimeout(timeout);
//   const todoCheckbox = document.getElementById('chk-' + todoId)
//   // add that id to an array
//   todoCheckbox.classList.remove('fa-check-circle');
//   todoCheckbox.classList.add('fa-circle');
//   todoCheckbox.setAttribute("onClick", `checkbox('${todoId}')`);
//   const completed = todoCheckbox.classList.contains('fa-check-circle');
//   todosToUpdate.push({ id: todoId, completed: completed });
//   console.log("todosToUpdate: " + todosToUpdate);
//   timeout = setTimeout(function () {
//     toggleCompletion(todosToUpdate);
//   }, stillEditingDelay);
// }

// function toggleCompletion(todosToUpdate) {
//   console.log('toggling todo - before axios request');
//   // display progress spinner
//   axios.post('/toggle-todo', {
//     todosToUpdate
//   }).then((res) => {
//     // hide progress spinner
//     console.log(res.data);
//     todosToUpdate = [];
//   }).catch(error => {
//     console.error(error);
//   });
// }

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
