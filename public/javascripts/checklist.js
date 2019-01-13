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
  axios.post('/lists', {

  }).then(res => {
    newList = res.data;
    li.setAttribute("class", "selected-list left-list-name");
    li.setAttribute("id", newList._id);
    li.appendChild(document.createTextNode("New List"));
    ul.insertBefore(li, ul.firstChild);
    if (prevSelected) { // nil check
      prevSelected.classList.remove("selected-list");
    }
  }).catch(error => {
    console.error(error);
  });
}

/************************
      REMOVING LISTS
************************/
function deleteList() {
  currentListId = document.getElementById('current-list').getAttribute("listid")
  axios.delete('/lists', {
    params: { id: currentListId }
  }).then(res => {
    window.location = "/lists";
  }).catch(error => {
    console.error(error);
  });
}
