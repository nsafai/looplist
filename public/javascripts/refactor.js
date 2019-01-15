
// NOTES FOR POTENTIAL REFACTOR BELOW:

// let needsUpdate = true;
// let updateInProcess = false;
//
// function waitThenUpdate() {
//   timeout = setTimeout(function () {
//     saveUpdate()
//   }, 500);
// }
//
// function saveUpdate() {
//   needsUpdate = false
//   updateInProcess = true
//   fetch('/save-data', { currentListTodos }).then((res) => {
//     return res.json()
//   }).then((json) => {
//     currentListTodos = json
//     if (needsUpdate) {
//       saveUpdate()
//     }
//   }).catch((err) => {
//     needsUpdate = true
//     saveUpdate()
//   })
// }
//
// function addTodo() {
//   clearTimeout(timeout)
//   // makes a todo
//   needsUpdate = true
//   saveUpdate()
// }

// class Checklist {
//   constructor(title, owner, parent, todos) {
//     this.title = title;
//     this.owner = owner
//     this.parent = parent;
//     this.todos = todos;
//   }
// }
//
// class Todo {
//   constructor(title, parent) {
//     this.title = title;
//     this.completed = false;
//     this.parent = parent;
//   }
// }
// // new Todo('', 1, '')
//
// const checkList = [
//   {title: 'brush', index: 1, parent: 'morning'},
//   {}
// ]
