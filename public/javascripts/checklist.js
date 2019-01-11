/************************
      ADDING LISTS
************************/

function createList() {
  alert("clicked createList!");
  // axios.post('/save-vote', {
  //   yesVote: propId
  // }).then(res => {
  //   const yesButton = document.getElementById(propId + '-yes');
  //   yesButton.classList.add("prop-voted");
  //   yesButton.innerHTML = 'Undo <strong>YES</strong>';
  //   yesButton.setAttribute("onClick", `undoYesVote('${propId}')`);
  //
  //   const noButton = document.getElementById(propId + '-no');
  //   noButton.classList.remove("prop-voted");
  //   noButton.innerHTML = 'Save <strong>NO</strong>';
  //   noButton.setAttribute("onClick", `saveNoVote('${propId}')`);
  // }).catch(error => {
  //   console.error(error);
  // });
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
