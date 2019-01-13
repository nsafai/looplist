/************************
  SETUP/SELECT TOP LIST
************************/

$('#ul-of-list-names li:first').addClass('selected-list');

/************************
      ADDING LISTS
************************/

function createList() {
  const ul = document.getElementById("ul-of-list-names");
  const li = document.createElement("li");
  var prevSelected = document.getElementsByClassName('selected-list')[0];
  // console.log(prevSelected.classList);
  axios.post('/lists', {}).then(res => {

    newList = res.data;
    // console.log(newList);

    li.setAttribute("class", "selected-list left-list-name");
    li.setAttribute("id", newList._id);
    li.appendChild(document.createTextNode("New List"));
    if (prevSelected) {
      prevSelected.classList.remove("selected-list");
    }
    ul.insertBefore(li, ul.firstChild);

  }).catch(error => {
    console.error(error);
  });
}

/************************
      REMOVING LISTS
************************/
function deleteList() {
  currentListId = document.getElementById('current-list').getAttribute("listid")
  // console.log(currentList);
  axios.delete('/lists', {
    params: {
      id: currentListId
    }
  }).then(res => {
    // console.log(res);
    // res.redirect('/lists');
    window.location = "/lists";
    // newList = res.data;
    // console.log(newList);

  }).catch(error => {
    console.error(error);
  });
}

/************************
     ADDING TO-DO'S
************************/

$(".to-do-ul").on('keyup', function(e) {
  if (e.keyCode == 13) {
    console.log('pressed enter!');
    $('.to-do-ul').append(`<div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="">
    </div>`);
    $(".to-do-input:last-of-type").focus();
    createTodo()
  }
});

$(".new-todo-link").on('click', function(e) {
  console.log('clicked new todo!');
  $('.to-do-ul').append(`<div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="">
    </div>`);
  $(".to-do-input:last-of-type").focus();
  createTodo()
});

function createTodo() {
  currentListId = document.getElementById('current-list').getAttribute("listid");
  axios.post('/todos', {
    currentListId: currentListId
  }).then(res => {
    // console.log(res);
    todo = res.data;
    $(".to-do-input:last-of-type").attr('todoid', todo._id);

    // newList = res.data;
    // console.log(newList);

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
      document.activeElement.parentElement.remove();
    }
  }
});
