var $searchCity = document.forms[0];
var $searchBox = document.querySelector('.searchbox');
var $searchResultsRow = document.querySelector('.search-results-row');
var $dataView = document.querySelectorAll('[data-view]');
var $searchCitiesAnchor = document.querySelector('.search-cities-anchor');
var $cityProfileContainer = document.querySelector('.profile-container');

$searchCity.addEventListener('submit', getSearchResults);
$searchResultsRow.addEventListener('click', cityClicked);
$searchCitiesAnchor.addEventListener('click', navbarClicked);

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
      data.searchResults = JSON.parse(xhr.response);
      renderSearchResults();
    });
    xhr.send();
  }
}

function renderSearchResults() {
  $searchResultsRow.textContent = '';
  for (var i = 0; i < data.searchResults._embedded['city:search-results'].length; i++) {
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

    var fullLength = data.searchResults._embedded['city:search-results'][i].matching_full_name.length;
    var commaIndex = data.searchResults._embedded['city:search-results'][i].matching_full_name.indexOf(',');
    var countryIndex = commaIndex + 2;
    var fullName = data.searchResults._embedded['city:search-results'][i].matching_full_name.split('');
    var country = fullName.splice(countryIndex, fullLength - 1).join('');
    var city = fullName.slice(0, commaIndex).join('');

    $column.className = 'col-12 col-sm-4 col-md-3 m-2 d-flex center-all city-card';
    $column.setAttribute('data-card-id', i);
    $cityCard.setAttribute('href', '#');
    $cityName.textContent = city;
    $countryName.textContent = country;

    $cityCard.appendChild($cityName);
    $cityCard.appendChild($countryName);
    $column.appendChild($cityCard);
    $searchResultsRow.appendChild($column);
  }
}

function cityClicked(event) {
  if (event.target.closest('.city-card') !== null) {
    data.currentCity.cityId = event.target.closest('.city-card').getAttribute('data-card-id');
    data.currentCity.cityObj = data.searchResults._embedded['city:search-results'][data.currentCity.cityId];
    getCityData();
    changeView('city-profile');
  }
}

function changeView(view) {
  data.currentView = view;
  for (var v = 0; v < $dataView.length; v++) {
    if ($dataView[v].getAttribute('data-view') === data.currentView) {
      $dataView[v].classList.remove('hidden');
    } else {
      $dataView[v].classList.add('hidden');
    }
  }
}

function navbarClicked(event) {
  if (event.target.classList.contains('search-cities-anchor')) {
    $searchCity.reset();
    $searchResultsRow.textContent = '';
    changeView('search');
  }
}

function getCityData() {
  var fullName = data.currentCity.cityObj.matching_full_name.split('');
  var commaIndex = fullName.indexOf(',');
  var countryIndex = commaIndex + 2;
  data.currentCity.cityName = fullName.slice(0, commaIndex).join('');
  data.currentCity.cityCountry = fullName.splice(countryIndex, fullName.length - 1).join('');

  var currentCityProfileUrl = data.currentCity.cityObj._links['city:item'].href;
  data.currentCity.cityProfileUrl = currentCityProfileUrl;

  $cityProfileContainer.textContent = '';

  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', currentCityProfileUrl);
  xhr2.reponseType = 'json';
  xhr2.addEventListener('load', function () {
    var result = JSON.parse(xhr2.response);
    if (result._links['city:urban_area'] === undefined) {
      data.currentCity.cityImageUrl = '../images/city-alt.jpg';
      data.currentCity.cityImageAtt.authorName = 'Rafael De Nadai';
      data.currentCity.cityImageAtt.authorUrl = 'https://tinyurl.com/4udjv35y';
      renderImage();
      renderCityDescription();
    } else {
      // GET IMAGE
      var slugUrl = result._links['city:urban_area'].href + 'images';
      var xhr3 = new XMLHttpRequest();
      xhr3.open('GET', slugUrl);
      xhr3.responseType = 'json';
      xhr3.addEventListener('load', function () {
        var xhr3Result = xhr3.response;
        data.currentCity.cityImageUrl = xhr3Result.photos[0].image.web;
        data.currentCity.cityImageAtt.authorName = xhr3Result.photos[0].attribution.photographer;
        data.currentCity.cityImageAtt.authorUrl = xhr3Result.photos[0].attribution.source;
        renderImage();
      });
      xhr3.send();
      // GET POPULATION
      var xhr4 = new XMLHttpRequest();
      xhr4.open('GET', data.currentCity.cityProfileUrl);
      xhr4.responseType = 'json';
      xhr4.addEventListener('load', function () {
        var xhr4Result = xhr4.response;
        data.currentCity.cityPop = xhr4Result.population.toLocaleString();
      });
      xhr4.send();
      // GET DESCRIPTION
      var scoresUrl = result._links['city:urban_area'].href + 'scores/';
      var xhr5 = new XMLHttpRequest();
      xhr5.open('GET', scoresUrl);
      xhr5.responseType = 'json';
      xhr5.addEventListener('load', function () {
        var xhr5Result = xhr5.response;
        data.currentCity.citySummary = xhr5Result.summary.split('<p>').join('').split('</p>').join('').split('<b>').join('').split('</b>').join('').trim();
        data.currentCity.scores.travelConnectivity = xhr5Result.categories[4].score_out_of_10;
        data.currentCity.scores.safety = xhr5Result.categories[7].score_out_of_10;
        data.currentCity.scores.leisure = xhr5Result.categories[14].score_out_of_10;
        data.currentCity.scores.outdoors = xhr5Result.categories[16].score_out_of_10;
        renderCityDescription();
      });
      xhr5.send();
      // GET TABLE DETAILS
      var detailsUrl = result._links['city:urban_area'].href + 'details/';
      var xhr6 = new XMLHttpRequest();
      xhr6.open('GET', detailsUrl);
      xhr6.responseType = 'json';
      xhr6.addEventListener('load', function () {
        // var xhr6Result = xhr6.response;
        // console.log(xhr6Result);
      });
      xhr6.send();
    }
  });
  xhr2.send();
}

function renderImage() {
  // <div class="row profile-img">
  //   <div class="col d-flex flex-wrap align-items-center my-4">
  //     <figure>
  //       <img src="" class="img-fluid" alt="city">
  //       <figcaption><a class="caption" href="">Author</a></figcaption>
  //     </figure>
  //   </div>
  // </div >

  var $imgRow = document.createElement('div');
  var $imgCol = document.createElement('div');
  var $figure = document.createElement('figure');
  var $img = document.createElement('img');
  var $figCap = document.createElement('figcapture');
  var $authorLink = document.createElement('a');

  $imgRow.className = 'row profile-img';
  $imgCol.className = 'col d-flex flex-wrap align-items-center my-4';
  $img.className = 'img-fluid';
  $img.setAttribute('src', data.currentCity.cityImageUrl);
  $authorLink.className = 'caption';
  $authorLink.setAttribute('href', data.currentCity.cityImageAtt.authorUrl);
  $authorLink.textContent = 'Photo by: ' + data.currentCity.cityImageAtt.authorName;

  $imgRow.appendChild($imgCol);
  $imgCol.appendChild($figure);
  $figure.appendChild($img);
  $figure.appendChild($figCap);
  $figCap.appendChild($authorLink);

  $cityProfileContainer.appendChild($imgRow);
}

function renderCityDescription() {
  // <div class="row profile-desc">
  //  <div class="col align-items-center text-center">
  //    <h2>city name</h2>
  //    <p>country<p><br>
  //    <p>description<p></br>
  //    <p>total pop</br>
  //    pop density<sup>2</sup></p>
  //  </div>
  // </div>

  var $headerRow = document.createElement('div');
  var $headerCol = document.createElement('div');
  var $cityName = document.createElement('h2');
  var $cityCountry = document.createElement('p');
  var $cityDesc = document.createElement('p');
  var $pop = document.createElement('p');

  $headerRow.className = 'row profile-desc';
  $headerCol.className = 'col align-items-center text-center';
  $cityName.textContent = data.currentCity.cityName;
  $cityCountry.textContent = data.currentCity.cityCountry;
  $cityDesc.textContent = data.currentCity.citySummary;
  $pop.textContent = 'Estimated Population: ' + data.currentCity.cityPop;

  $headerRow.appendChild($headerCol);
  $headerCol.appendChild($cityName);
  $headerCol.appendChild($cityCountry);
  $headerCol.appendChild($cityDesc);
  $headerCol.appendChild($pop);

  $cityProfileContainer.appendChild($headerRow);
}

// function renderCityScores() {
// <div class="row profile-travel-scores my-4">
//    <div class="col align-items-center text-center">
//      <h3>Travel Scores</h3>
//      <p>Travel Connectivity #/10</p>
//      <div class="progress">
//        <div class="progress-bar bg-warning travel-connectivity-score" role="progressbar"
//            aria-valuenow="#" aria-valuemin="0" aria-valuemax="10"></div>
//      </div>
//      <p>Safety #/10</p>
//        <div class="progress">
//          <div class="progress-bar bg-warning safety-score" role="progressbar" aria-valuenow="#"
//            aria-valuemin="0" aria-valuemax="10"></div>
//        </div>
//        <p>Leisure and Culture #/10</p>
//        <div class="progress">
//          <div class="progress-bar bg-success leisure-score" role="progressbar" aria-valuenow="#"
//              aria-valuemin="0" aria-valuemax="10">
//          </div>
//        </div>
//        <p>Outdoors #/10</p>
//        <div class="progress">
//          <div class="progress-bar bg-success outdoors-score" role="progressbar" aria-valuenow="#"
//             aria-valuemin="0" aria-valuemax="10">
//          </div>
//        </div>
//    </div >
// </div >

// }
