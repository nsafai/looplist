var timeout = null;
var stillEditingDelay = 800;

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
  $("#first-list-butn").hide();
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
    location.reload();
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
    const listNamesContainer = $('#ul-of-list-names');
    const listViewContainer = $('#list-items-view');
    const listViewHelperText = $('#select-a-list-helper-div');

    listNamesContainer.empty();

    if (response.data.length === 0) {
      listNamesContainer.append(`
        <li class="search-results-txt">No results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
      `);
    } else {
      listNamesContainer.append(`
        <li class="search-results-txt">Showing results for "<span class="bold-help-txt">${searchTerm}</span>"</li>
      `)
      response.data.forEach(function(list) {
        // console.log(list);
        listViewContainer.empty();
        listViewHelperText.removeClass('hidden');
        
        listNamesContainer.append(`
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
