var $searchCity = document.forms[0];
var $searchBox = document.querySelector('.searchbox');

$searchCity.addEventListener('submit', findSearchResults);

function findSearchResults(event) {
  event.preventDefault();
  var searchValue = null;
  var searchRequest = 'https://api.teleport.org/api/cities/?search=';
  if ($searchBox.value !== '') {
    searchValue = $searchBox.value.split(' ').join('%20');
    searchRequest += searchValue;
    getSearchResults(searchRequest);
  }
}

function getSearchResults(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', search);
  xhr.reponseType = 'json';
  xhr.addEventListener('load', function () {
    var searchResults = JSON.parse(xhr.response);
    renderSearchResults(searchResults);
  });
  xhr.send();
}

function renderSearchResults(resultsObj) {

}
