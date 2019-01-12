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
    prevSelected.classList.remove("selected-list");
    ul.insertBefore(li, ul.firstChild);

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
  }
});

$(".new-todo-link").on('click', function(e) {
  console.log('clicked new todo!');
  $('.to-do-ul').append(`<div class="to-do-and-chkbox">
      <a class="chkbox far fa-circle" href="" tabindex="-1"></a>
      <input class='to-do-input' value="">
    </div>`);
  $(".to-do-input:last-of-type").focus();
});

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
