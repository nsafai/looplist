var timeout = null;
var stillEditingDelay = 800;

/************************
* SETUP/SELECT TOP LIST *
************************/

$('#ul-of-list-names li:first').addClass('selected-list');
const listsContainer = document.getElementById("ul-of-list-names");
const todosContainer = $('#todos-container');
const listTitleContainer = $('#list-title-container');

/************************
 *    GET LIST ITEMS    *
 ***********************/

function getListItems(listId) {
  const oldCurrentList = $(`.selected-list`)[0];
  console.log(oldCurrentList);
  oldCurrentList.classList.remove('selected-list');
  const newCurrentList = $(`#${listId}`);
  newCurrentList.addClass('selected-list');

  axios
    .get(`lists/${listId}`, {})
    .then(function (response) {
      console.log(response.data);
      const { currentList, currentListTodos, lists } = response.data;
      listTitleContainer.empty();
      listTitleContainer.append(`
        <input id="current-list" listid="${currentList._id}"
        value="${currentList.title}" placeholder="List Name"
        oninput="saveListName('${currentList._id}')"></input>
      `);
      todosContainer.empty();
      currentListTodos.forEach(function(todo) {
        if (todo.completed) {
          todosContainer.append(`
          <div class="to-do-and-chkbox">
            <a class="chkbox far fa-check-circle" id="chk-${todo._id}"
            onClick="uncheckbox('${todo._id}')" tabindex="-1"></a>
            <input class='to-do-input' value="${todo.name}" id="${todo._id}"
            todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
          </div>
          `);
        } else {
        todosContainer.append(`
          <div class="to-do-and-chkbox">
            <a class="chkbox far fa-circle" id="chk-${todo._id}"
            onClick="checkbox('${todo._id}')" tabindex="-1"></a>
            <input class='to-do-input' value="${todo.name}" id="${todo._id}"
            todoid="${todo._id}" oninput="saveTodo('${todo._id}')">
          </div>
        `)
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    })
}

/************************
      ADDING LISTS
************************/

function createList() {

  const li = document.createElement("li");
  var prevSelected = document.getElementsByClassName('selected-list')[0];
  $("#first-list-butn").hide();
  // console.log(prevSelected.classList);
  axios.post('/lists', {})
    .then(res => {
      newList = res.data;
      li.setAttribute("class", "selected-list left-list-name");
      li.setAttribute("id", newList._id);
      li.appendChild(document.createTextNode("New List"));
      listsContainer.insertBefore(li, listsContainer.firstChild);
      if (prevSelected) { // nil check
        prevSelected.classList.remove("selected-list");
      }
      location.reload();
    })
    .catch(error => {
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
  })
    .then(res => {
      window.location = "/lists";
    })
    .catch(error => {
      console.error(error);
    });
}

/************************
     SAVING LIST NAME
************************/

function saveListName(currentListId) {
  clearTimeout(timeout);
  var listNameInputValue = document.getElementById('current-list').value;
  var listNameLeftPane = document.getElementById(currentListId);
  listNameLeftPane.innerHTML = listNameInputValue;

  timeout = setTimeout(function () {
    axios.post('/save-list-name', {
      currentListId: currentListId,
      newListName: listNameInputValue
    }).then(res => {
      console.log(res);
    }).catch(error => {
      console.error(error);
    });
  }, stillEditingDelay);
}


/************************
      SEARCH LISTS
************************/
function search(event) {
  clearTimeout(timeout);
  event.preventDefault();
  const searchTerm = document.getElementById('search-lists-input').value
  console.log('searching for', searchTerm);
  
  
  axios.get('search', {
    params: {
      term: searchTerm
    }
  })
  .then(function (response) {
    console.log(response.data);
    const listViewContainer = $('#list-items-view');
    const listViewHelperText = $('#select-a-list-helper-div');

    listsContainer.empty();

    if (response.data.length === 0) {
      listsContainer.append(`
        <li class="search-results-txt">No results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
      `);
    } else {
      listsContainer.append(`
        <li class="search-results-txt">Showing results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
      `)
      response.data.forEach(function(list) {
        // console.log(list);
        listViewContainer.empty();
        listViewHelperText.removeClass('hidden');
        
        listsContainer.append(`
        <a href="/lists/${list._id}">
          <li class="left-list-name" id="${list._id}">${list.title}</li>
        </a>
        `);
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

$('#search-lists-input').on('input', function(event) {
  timeout = setTimeout(function () {
    search(event);
  }, stillEditingDelay);
})

$('#search-lists-btn').click(function(event) {
  search(event);
})
