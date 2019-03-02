var timeout = null;
var stillEditingDelay = 800;

/************************
* SETUP/SELECT TOP LIST *
************************/

$('#ul-of-list-names li:first').addClass('selected-list');
const listsContainer = $('#ul-of-list-names');
const todosContainer = $('#todos-container');
const listTitleContainer = $('#list-title-container');
const listViewContainer = $('#list-items-view');
const listViewHelperText = $('#select-a-list-helper-div');

/************************
      ADDING LISTS
************************/

function createList() {

  const prevSelected = $('.selected-list')[0];
  axios.post('/lists', {})
    .then(res => {
      list = res.data;
      listsContainer.prepend(`
        <a onclick="getListItems('${list._id}')">
          <li class="left-list-name selected-list" id="${list._id}">${list.title}</li>
        </a>
      `);
      if (prevSelected) { // nil check
        prevSelected.classList.remove("selected-list");
      }
      getListItems(list._id);
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
function search() {
  const currentListId = $(`#current-list`).attr("listid");
  clearTimeout(timeout);
  const searchTerm = document.getElementById('search-lists-input').value
  console.log('searching for', searchTerm);
  axios
    .get('search', {
      params: {
        term: searchTerm
      }
    })
    .then(function (response) {
      console.log(response.data);
      listsContainer.empty();
      if (response.data.length === 0) {
        listsContainer.append(`
          <li class="search-results-txt">No results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
        `);
      } else {
        if (searchTerm) {
          listsContainer.append(`
            <li class="search-results-txt">Showing results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
          `);
        }
        response.data.forEach(function(list) {
          if (list._id === currentListId) {
            listsContainer.append(`
            <a onclick="getListItems('${list._id}')">
              <li class="left-list-name selected-list" id="${list._id}">${list.title}</li>
            </a>
          `);
          } else {
            listsContainer.append(`
            <a onclick="getListItems('${list._id}')">
              <li class="left-list-name" id="${list._id}">${list.title}</li>
            </a>
          `);
          }
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
  event.preventDefault();
  search(event);
})
