/* eslint-disable no-undef */
const collapseBtn = $('#collapse-btn')
const listContainer = $('#list-container')
const leftPane = $('#left-pane')
const leftPaneContent = $('#left-pane-content')

collapseBtn.click(() => {
  listContainer.toggleClass('hidden-left');
  leftPane.toggleClass('hidden-left');
  leftPaneContent.toggleClass('hidden-left');
})
