var $searchCity = document.forms[0];
var $searchBox = document.querySelector('.searchbox');
var $searchResultsRow = document.querySelector('.search-results-row');

$searchCity.addEventListener('submit', getSearchResults);
$searchResultsRow.addEventListener('click', saveCity);

function getSearchResults(event) {
  event.preventDefault();
  var searchValue = null;
  var searchRequest = 'https://api.teleport.org/api/cities/?search=';
  if ($searchBox.value !== '') {
    searchValue = $searchBox.value.split(' ').join('%20');
    searchRequest += searchValue;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', searchRequest);
    xhr.reponseType = 'json';
    xhr.addEventListener('load', function () {
      var searchResults = JSON.parse(xhr.response);
      renderSearchResults(searchResults);
    });
    xhr.send();
  }
}

function renderSearchResults(resultsObj) {
  $searchResultsRow.textContent = '';
  data.searchResults = resultsObj._embedded['city:search-results'];
  for (var i = 0; i < resultsObj._embedded['city:search-results'].length; i++) {
    // <div class="city-card m-2 col-sm-4 d-flex center-all">
    //    <a href="#">
    //        <h5>City Name<h5>
    //        <p>Area, Country<p>
    //    </a>
    // </div>

    var $column = document.createElement('div');
    var $cityCard = document.createElement('a');
    var $cityName = document.createElement('h5');
    var $countryName = document.createElement('p');

    var fullLength = resultsObj._embedded['city:search-results'][i].matching_full_name.length;
    var commaIndex = resultsObj._embedded['city:search-results'][i].matching_full_name.indexOf(',');
    var countryIndex = commaIndex + 2;
    var fullName = resultsObj._embedded['city:search-results'][i].matching_full_name.split('');
    var country = fullName.splice(countryIndex, fullLength - 1).join('');
    var city = fullName.slice(0, commaIndex).join('');

    $column.classList.add('col-12');
    $column.classList.add('col-sm-4');
    $column.classList.add('col-md-3');
    $column.classList.add('m-2');
    $column.classList.add('d-flex');
    $column.classList.add('center-all');
    $column.classList.add('city-card');
    $column.setAttribute('data-card-id', i + 1);
    $cityCard.setAttribute('href', '#');
    $cityName.textContent = city;
    $countryName.textContent = country;

    $cityCard.appendChild($cityName);
    $cityCard.appendChild($countryName);
    $column.appendChild($cityCard);
    $searchResultsRow.appendChild($column);
  }
}

function saveCity(event) {
  if (event.target.closest('.city-card') !== null) {
    var cityId = event.target.closest('.city-card').getAttribute('data-card-id') - 1;
    data.currentCityId = cityId;
    data.currentCity = data.searchResults[cityId];
    changeView();
  }
}

function changeView(view) {
}
