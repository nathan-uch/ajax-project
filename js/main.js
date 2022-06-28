var $searchCity = document.forms[0];
var $addToMyCitiesModal = document.forms[1];
var $addNotesModal = document.forms[2];
var $searchBox = document.querySelector('.searchbox');
var $searchResultsRow = document.querySelector('.search-results-row');
var $dataView = document.querySelectorAll('[data-view]');
var $searchCitiesAnchor = document.querySelector('.search-cities-anchor');
var $userCitiesAnchor = document.querySelector('.user-cities-anchor');
var $cityProfileImg = document.querySelector('.profile-img');
var $cityProfileDesc = document.querySelector('.profile-desc');
var $cityScoresContainer = document.querySelector('.city-profile-score');
var $cityLocationsContainer = document.querySelector('.profile-leisure');
var $cityCostsContainer = document.querySelector('.profile-costs');
var $modalYear = document.querySelector('#year');
var $saveCityBtn = document.querySelector('.save-city-btn');
var $typeOfVisit = document.querySelector('#visit-type');
var $visitMonth = document.querySelector('#month');
var $visitYear = document.querySelector('#year');
var $userCitiesList = document.querySelector('.user-cities-display');
var $livesOption = document.querySelector('#lives-option');
var $modalMessage = document.querySelector('.modal-message');
var $sortOption = document.querySelector('#sort-cities');
var $removeCityBtn = document.querySelector('#remove-city-btn');
var $removeCityDisplay = document.querySelector('.remove-city-display');
var $userCityHeader = document.querySelector('.user-city-head');
var $userCityDescription = document.querySelector('.user-city-description-section');
var $userCityAbout = document.querySelector('.user-city-about-section');
var $userCityScores = document.querySelector('.user-city-scores-row');
var $userCityLeisureTable = document.querySelector('.user-city-leisure-table');
var $userCityCostTable = document.querySelector('.user-city-cost-table');
var $sectionsCollapse = document.querySelectorAll('.collapse-head');
var $addNotesBtn = document.querySelector('#add-note-btn');
var $noteTitle = document.querySelector('#note-title');
var $noteMessage = document.querySelector('#note-message');
var $notesSection = document.querySelector('.user-city-notes-section');

$searchCity.addEventListener('submit', getSearchResults);
$searchResultsRow.addEventListener('click', saveCityInfo);
$searchCitiesAnchor.addEventListener('click', switchNavbarPage);
$userCitiesAnchor.addEventListener('click', switchNavbarPage);
$saveCityBtn.addEventListener('click', saveCitytoUserList);
$typeOfVisit.addEventListener('change', renderModalYears);
$visitMonth.addEventListener('change', clearMessage);
$visitYear.addEventListener('change', clearMessage);
$sortOption.addEventListener('change', sortMyCities);
$removeCityBtn.addEventListener('click', deleteCity);
$addNotesBtn.addEventListener('click', addNotesClickedBtn);

for (var c = 0; c < $sectionsCollapse.length; c++) {
  $sectionsCollapse[c].addEventListener('click', updateChevron);
}

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
    // <div class="city-card m-2 col-sm-4 col-md-3 d-flex justify-content-center text-center">
    //    <a href="#" class="searched-card position-relative">
    //        <h5 class="mt-3">City Name<h5>
    //        <p class="search-country">Area, Country<p>
    //        <i class="fa-solid fa-plane fa-lg position-absolute"></i>
    //    </a>
    // </div>

    var $column = document.createElement('div');
    var $cityCard = document.createElement('a');
    var $cityName = document.createElement('h5');
    var $countryName = document.createElement('p');
    var $cardIcon = document.createElement('i');

    var fullLength = data.searchResults._embedded['city:search-results'][i].matching_full_name.length;
    var commaIndex = data.searchResults._embedded['city:search-results'][i].matching_full_name.indexOf(',');
    var countryIndex = commaIndex + 2;
    var parenIndex = data.searchResults._embedded['city:search-results'][i].matching_full_name.indexOf('(');
    var fullName = data.searchResults._embedded['city:search-results'][i].matching_full_name;
    var areaCountry = null;
    if (+parenIndex === -1) {
      areaCountry = fullName.substring(countryIndex, fullLength);
    } else {
      areaCountry = fullName.substring(countryIndex, parenIndex);
    }
    var secondComma = areaCountry.indexOf(',') + 2;
    var country = areaCountry.substring(secondComma, areaCountry.length);
    var city = fullName.substring(0, commaIndex);

    $column.className = 'city-card m-2 col-sm-4 col-md-3 d-flex center-all';
    $column.setAttribute('data-card-id', i);
    $cityCard.setAttribute('href', '#');
    $cityCard.className = 'searched-card position-relative';
    $cityName.textContent = city;
    $countryName.textContent = country;
    $countryName.className = 'search-country';
    $cardIcon.className = 'fa-solid fa-plane fa-lg position-absolute';

    $cityCard.appendChild($cityName);
    $cityCard.appendChild($countryName);
    $cityCard.appendChild($cardIcon);
    $column.appendChild($cityCard);
    $searchResultsRow.appendChild($column);
  }
}

function saveCityInfo(event) {
  resetDataCurrentCity();

  if (event.target.closest('.city-card') !== null) {
    data.currentCity.searchCardId = event.target.closest('.city-card').getAttribute('data-card-id');
    data.currentCity.cityObj = data.searchResults._embedded['city:search-results'][data.currentCity.searchCardId];
    changeView('city-profile');
    getCityData();
  }
}

function changeView(view) {
  data.currentView = view;
  for (var v = 0; v < $dataView.length; v++) {
    if ($dataView[v].getAttribute('data-view') === data.currentView) {
      if (data.currentView === 'city-profile') {
        $cityProfileImg.textContent = '';
        $cityProfileDesc.textContent = '';
        $cityScoresContainer.textContent = '';
        $cityLocationsContainer.textContent = '';
        $cityCostsContainer.textContent = '';
        $dataView[v].classList.remove('hidden');
      } else if (data.currentView === 'user-city-profile') {
        $userCityHeader.textContent = '';
        $userCityDescription.textContent = '';
        $userCityAbout.textContent = '';
        $userCityScores.textContent = '';
        $userCityLeisureTable.textContent = '';
        $userCityCostTable.textContent = '';
        $dataView[v].classList.remove('hidden');
      } else if (data.currentView === 'user-cities' || data.currentView === 'search') {
        $dataView[v].classList.remove('hidden');
      }
    } else {
      $dataView[v].classList.add('hidden');
    }
  }
}

function switchNavbarPage(event) {
  if (event.target.classList.contains('search-cities-anchor')) {
    $searchCity.reset();
    $searchResultsRow.textContent = '';
    changeView('search');
  } else {
    changeView('user-cities');
  }
}

function removeHtmlTags(string) {
  var t = document.createElement('div');
  t.innerHTML = string;
  return t.textContent || t.innerText || '';
}

function getCityData() {
  var fullName = data.currentCity.cityObj.matching_full_name.split('');
  var commaIndex = fullName.indexOf(',');
  var countryIndex = commaIndex + 2;
  data.currentCity.cityName = fullName.slice(0, commaIndex).join('');
  data.currentCity.cityArea = fullName.splice(countryIndex, fullName.length - 1).join('');

  var currentCityProfileUrl = data.currentCity.cityObj._links['city:item'].href;
  data.currentCity.cityProfileUrl = currentCityProfileUrl;

  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', currentCityProfileUrl);
  xhr2.reponseType = 'json';
  xhr2.addEventListener('load', function () {
    var xhr2Result = JSON.parse(xhr2.response);
    data.currentCity.cityPop = xhr2Result.population.toLocaleString();
    if (!xhr2Result._links['city:urban_area']) {
      data.currentCity.hasDetails = false;
      data.currentCity.citySummary = 'Sorry, there are no details about this city.';
      data.currentCity.cityImageUrl = '../images/city-alt.jpg';
      data.currentCity.cityImageAtt.authorName = 'Rafael De Nadai';
      data.currentCity.cityImageAtt.authorUrl = 'https://tinyurl.com/4udjv35y';
      renderImageAndTitle(data.currentCity);
      renderCityDescription(data.currentCity);
    } else {
      data.currentCity.hasDetails = true;
      // GET IMAGE
      var slugUrl = xhr2Result._links['city:urban_area'].href + 'images';
      var xhr3 = new XMLHttpRequest();
      xhr3.open('GET', slugUrl);
      xhr3.responseType = 'json';
      xhr3.addEventListener('load', function () {
        var xhr3Result = xhr3.response;
        data.currentCity.cityImageUrl = xhr3Result.photos[0].image.web;
        data.currentCity.cityImageAtt.authorName = xhr3Result.photos[0].attribution.photographer;
        data.currentCity.cityImageAtt.authorUrl = xhr3Result.photos[0].attribution.source;
        renderImageAndTitle(data.currentCity);
      });
      xhr3.send();
      // GET DESCRIPTION
      var scoresUrl = xhr2Result._links['city:urban_area'].href + 'scores/';
      var xhr4 = new XMLHttpRequest();
      xhr4.open('GET', scoresUrl);
      xhr4.responseType = 'json';
      xhr4.addEventListener('load', function () {
        var xhr4Result = xhr4.response;
        data.currentCity.citySummary = removeHtmlTags(xhr4Result.summary);
        data.currentCity.scores.travel = Math.round(xhr4Result.categories[4].score_out_of_10);
        data.currentCity.scores.safety = Math.round(xhr4Result.categories[7].score_out_of_10);
        data.currentCity.scores.leisure = Math.round(xhr4Result.categories[14].score_out_of_10);
        data.currentCity.scores.outdoors = Math.round(xhr4Result.categories[16].score_out_of_10);
        renderCityDescription(data.currentCity);
        renderCityScores(data.currentCity);
      });
      xhr4.send();

      // GET TABLE DETAILS
      var detailsUrl = xhr2Result._links['city:urban_area'].href + 'details/';
      var xhr5 = new XMLHttpRequest();
      xhr5.open('GET', detailsUrl);
      xhr5.responseType = 'json';
      xhr5.addEventListener('load', function () {
        var xhr5Result = xhr5.response;
        // CITY LOCATIONS
        var curLocations = [];
        var artGal = {};
        artGal.name = 'Art Galleries';
        artGal.num = xhr5Result.categories[4].data[1].int_value;
        artGal.score = Math.round((xhr5Result.categories[4].data[0].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(artGal);
        var cinemas = {};
        cinemas.name = 'Cinemas';
        cinemas.num = xhr5Result.categories[4].data[3].int_value;
        cinemas.score = Math.round((xhr5Result.categories[4].data[2].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(cinemas);
        var comClubs = {};
        comClubs.name = 'Comedy Clubs';
        comClubs.num = xhr5Result.categories[4].data[5].int_value;
        comClubs.score = Math.round((xhr5Result.categories[4].data[4].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(comClubs);
        var conVenues = {};
        conVenues.name = 'Concert Venues';
        conVenues.num = xhr5Result.categories[4].data[7].int_value;
        conVenues.score = Math.round((xhr5Result.categories[4].data[6].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(conVenues);
        var hisSites = {};
        hisSites.name = 'Historical Sites';
        hisSites.num = xhr5Result.categories[4].data[9].int_value;
        hisSites.score = Math.round((xhr5Result.categories[4].data[8].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(hisSites);
        var museums = {};
        museums.name = 'Museums';
        museums.num = xhr5Result.categories[4].data[11].int_value;
        museums.score = Math.round((xhr5Result.categories[4].data[10].float_value + Number.EPSILON) * 100) / 100;
        curLocations.push(museums);
        data.currentCity.locations = curLocations;
        renderLeisureTable(data.currentCity);

        // CITY COSTS
        var curCosts = [];
        var lunch = {};
        lunch.name = 'Restaurant Lunch';
        lunch.cost = '$' + xhr5Result.categories[3].data[8].currency_dollar_value;
        curCosts.push(lunch);
        var pubTransport = {};
        pubTransport.name = 'Monthly Public Transport';
        pubTransport.cost = '$' + xhr5Result.categories[3].data[7].currency_dollar_value;
        curCosts.push(pubTransport);
        var beer = {};
        beer.name = 'Beer';
        beer.cost = '$' + xhr5Result.categories[3].data[6].currency_dollar_value;
        curCosts.push(beer);
        var movies = {};
        movies.name = 'Movie Tickets';
        movies.cost = '$' + xhr5Result.categories[3].data[4].currency_dollar_value;
        curCosts.push(movies);
        var apples = {};
        apples.name = 'Apples (kg)';
        apples.cost = '$' + xhr5Result.categories[3].data[1].currency_dollar_value;
        curCosts.push(apples);
        data.currentCity.costs = curCosts;
        renderCostTable(data.currentCity);
      });
      xhr5.send();
    }
  });
  xhr2.send();
  renderModalYears();
}

function renderImageAndTitle(city) {
  //   <figure>
  //     <img src="" class="img-fluid" alt="city">
  //     <figcaption><a class="caption" href="">Author</a></figcaption>
  //   </figure>
  //   <h2>city name</h2>
  //   <p>country<p>

  var $figure = document.createElement('figure');
  var $img = document.createElement('img');
  var $figCap = document.createElement('figcapture');
  var $authorLink = document.createElement('a');
  var $cityName = document.createElement('h2');
  var $cityArea = document.createElement('p');

  $img.setAttribute('src', city.cityImageUrl);
  $img.className = 'img-fluid';
  $authorLink.className = 'caption';
  $authorLink.setAttribute('href', city.cityImageAtt.authorUrl);
  $authorLink.textContent = 'Photo by: ' + city.cityImageAtt.authorName;
  $cityName.textContent = city.cityName;
  $cityName.className = 'col-12';
  $cityArea.textContent = city.cityArea;
  $cityArea.className = 'col-12 w-100';

  $figure.appendChild($img);
  $figure.appendChild($figCap);
  $figCap.appendChild($authorLink);
  if (data.currentView === 'city-profile') {
    $cityProfileImg.appendChild($figure);
    $cityProfileImg.appendChild($cityName);
    $cityProfileImg.appendChild($cityArea);
  } else if (data.currentView === 'user-city-profile') {
    $userCityHeader.appendChild($figure);
    $userCityHeader.appendChild($cityName);
    $userCityHeader.appendChild($cityArea);
  }
}

function renderCityDescription(city) {
  //   <button type="button" class="btn add-btn col-12" data-bs-target="#add-modal" data-bs-toggle="modal">ADD CITY TO LIST</button>
  //   <p class="w-100">description <p class="w-100 mt-2">total pop</p><p>

  var $cityDesc = document.createElement('p');
  var $pop = document.createElement('p');

  $cityDesc.textContent = city.citySummary;
  $cityDesc.className = 'p-3';
  $pop.textContent = 'Estimated Population: ' + city.cityPop;

  if (data.currentView === 'city-profile') {
    var $addCityBtn = document.createElement('button');
    $addCityBtn.setAttribute('type', 'button');
    $addCityBtn.setAttribute('data-bs-target', '#add-city-modal');
    $addCityBtn.setAttribute('data-bs-toggle', 'modal');
    $addCityBtn.className = 'btn add-city-btn col-12';
    $addCityBtn.textContent = 'ADD CITY TO LIST';
    $cityProfileDesc.appendChild($addCityBtn);
    $cityProfileDesc.appendChild($cityDesc);
    $cityProfileDesc.appendChild($pop);

  } else if (data.currentView === 'user-city-profile') {
    $pop.className = 'w-100 mt-2';
    $cityDesc.appendChild($pop);
    $userCityAbout.appendChild($cityDesc);
  }
}

function renderCityScores(city) {
//     <h3>Travel Scores</h3>
//     <div class="col align-items-center text-center">
//       <p>Travel Connectivity #/10</p>
//       <div class="progress">
//         <div class="progress-bar bg-warning travel-score" role="progressbar"
//            aria-valuenow="#" aria-valuemin="0" aria-valuemax="10"></div>
//       </div>
//       <p>Safety #/10</p>
//       <div class="progress">
//         <div class="progress-bar bg-warning safety-score" role="progressbar" aria-valuenow="#"
//          aria-valuemin="0" aria-valuemax="10">
//         </div>
//       </div>
//       <p>Leisure and Culture #/10</p>
//       <div class="progress">
//         <div class="progress-bar bg-success leisure-score" role="progressbar" aria-valuenow="#"
//            aria-valuemin="0" aria-valuemax="10">
//         </div>
//       </div>
//       <p>Outdoors #/10</p>
//       <div class="progress">
//         <div class="progress-bar bg-success outdoors-score" role="progressbar" aria-valuenow="#"
//           aria-valuemin="0" aria-valuemax="10">
//         </div>
//      </div>

  var $scoresCol = document.createElement('div');
  var $travelHead = document.createElement('p');
  var $travelProg = document.createElement('div');
  var $travelScore = document.createElement('div');
  var $safetyHead = document.createElement('p');
  var $safetyProg = document.createElement('div');
  var $safetyScore = document.createElement('div');
  var $leisureHead = document.createElement('p');
  var $leisureProg = document.createElement('div');
  var $leisureScore = document.createElement('div');
  var $outdoorsHead = document.createElement('p');
  var $outdoorsProg = document.createElement('div');
  var $outdoorsScore = document.createElement('div');

  $scoresCol.className = 'col align-items-center text-center';
  $travelProg.className = 'progress';
  $safetyProg.className = 'progress';
  $leisureProg.className = 'progress';
  $outdoorsProg.className = 'progress';
  $travelScore.className = 'progress-bar travel-score';
  $travelScore.style.width = (city.scores.travel * 10) + '%';
  $travelHead.textContent = 'Travel Connectivity ' + city.scores.travel + '/10';
  $travelScore.setAttribute('role', 'progressbar');
  $travelScore.setAttribute('aria-valuenow', city.scores.travel);
  $travelScore.setAttribute('aria-valuemin', '0');
  $travelScore.setAttribute('aria-valuemax', '10');
  checkScore($travelScore);

  $safetyScore.className = 'progress-bar safety-score';
  $safetyScore.style.width = (city.scores.safety * 10) + '%';
  $safetyHead.textContent = 'Safety ' + city.scores.safety + '/10';
  $safetyScore.setAttribute('role', 'progressbar');
  $safetyScore.setAttribute('aria-valuenow', city.scores.safety);
  $safetyScore.setAttribute('aria-valuemin', '0');
  $safetyScore.setAttribute('aria-valuemax', '10');
  checkScore($safetyScore);

  $leisureScore.className = 'progress-bar leisure-score';
  $leisureScore.style.width = (city.scores.leisure * 10) + '%';
  $leisureHead.textContent = 'Leisure and Culture ' + city.scores.leisure + '/10';
  $leisureScore.setAttribute('role', 'progressbar');
  $leisureScore.setAttribute('aria-valuenow', city.scores.leisure);
  $leisureScore.setAttribute('aria-valuemin', '0');
  $leisureScore.setAttribute('aria-valuemax', '10');
  checkScore($leisureScore);

  $outdoorsScore.className = 'progress-bar outdoors-score';
  $outdoorsScore.style.width = (city.scores.outdoors * 10) + '%';
  $outdoorsHead.textContent = 'Outdoors ' + city.scores.outdoors + '/10';
  $outdoorsScore.setAttribute('role', 'progressbar');
  $outdoorsScore.setAttribute('aria-valuenow', city.scores.outdoors);
  $outdoorsScore.setAttribute('aria-valuemin', '0');
  $outdoorsScore.setAttribute('aria-valuemax', '10');
  checkScore($outdoorsScore);

  $scoresCol.appendChild($travelHead);
  $scoresCol.appendChild($travelProg);
  $travelProg.appendChild($travelScore);
  $scoresCol.appendChild($safetyHead);
  $scoresCol.appendChild($safetyProg);
  $safetyProg.appendChild($safetyScore);
  $scoresCol.appendChild($leisureHead);
  $scoresCol.appendChild($leisureProg);
  $leisureProg.appendChild($leisureScore);
  $scoresCol.appendChild($outdoorsHead);
  $scoresCol.appendChild($outdoorsProg);
  $outdoorsProg.appendChild($outdoorsScore);

  if (data.currentView === 'city-profile') {
    var $scoreHeader = document.createElement('h3');
    $scoreHeader.textContent = 'Travel Scores';
    $cityScoresContainer.appendChild($scoreHeader);
    $cityScoresContainer.appendChild($scoresCol);
  } else if (data.currentView === 'user-city-profile') {
    $userCityScores.appendChild($scoresCol);
  }
}

function renderLeisureTable(city) {
  //   <table class="table table-hover w-100 m-auto">
  //     <thead>
  //       <tr>
  //         <th scope="col">Category</th>
  //         <th scope="col">Amount</th>
  //         <th scope="col">Score</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       <tr> *6
  //         <td>leisure location</td>
  //         <td>num</td>
  //         <td>score</td>
  //       </tr>
  //     </tbody>
  //   </table>

  var $leiTable = document.createElement('table');
  var $leiTHead = document.createElement('thead');
  var $headRow = document.createElement('tr');
  var $th1 = document.createElement('th');
  var $th2 = document.createElement('th');
  var $th3 = document.createElement('th');

  $leiTable.className = 'table table-hover w-100 m-auto';
  $th1.setAttribute('scope', 'col');
  $th1.textContent = 'Category';
  $th2.setAttribute('scope', 'col');
  $th2.textContent = 'Amount';
  $th3.setAttribute('scope', 'col');
  $th3.textContent = 'Score';

  $leiTable.appendChild($leiTHead);
  $leiTHead.appendChild($headRow);
  $headRow.appendChild($th1);
  $headRow.appendChild($th2);
  $headRow.appendChild($th3);
  $leiTable.appendChild(renderTableData(city.locations));

  if (data.currentView === 'city-profile') {
    $cityLocationsContainer.appendChild($leiTable);
  } else if (data.currentView === 'user-city-profile') {
    $userCityLeisureTable.appendChild($leiTable);
  }
}

function renderCostTable(city) {
  //   <table class="table table-hover w-100 m-auto">
  //     <thead>
  //       <tr>
  //         <th scope="col">Category</th>
  //         <th scope="col">Average Cost</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       <tr> *5
  //         <td>category</td>
  //         <td>cost</td>
  //       </tr>
  //     </tbody>
  //   </table>
  // </div>

  var $costTable = document.createElement('table');
  var $costTHead = document.createElement('thead');
  var $headRow = document.createElement('tr');
  var $th1 = document.createElement('th');
  var $th2 = document.createElement('th');

  $costTable.className = 'table table-hover w-100 m-auto';
  $th1.setAttribute('scope', 'col');
  $th1.textContent = 'Category';
  $th2.setAttribute('scope', 'col');
  $th2.textContent = 'Average Cost';

  $costTable.appendChild($costTHead);
  $costTHead.appendChild($headRow);
  $headRow.appendChild($th1);
  $headRow.appendChild($th2);
  $costTable.appendChild(renderTableData(city.costs));

  if (data.currentView === 'city-profile') {
    $cityCostsContainer.appendChild($costTable);
  } else if (data.currentView === 'user-city-profile') {
    $userCityCostTable.appendChild($costTable);
  }
}

function renderTableData(array) {
  var $tBody = document.createElement('tbody');
  for (var r = 0; r < array.length; r++) {
    var $row = document.createElement('tr');
    for (const prop in array[r]) {
      var $td = document.createElement('td');
      $td.textContent = array[r][prop];
      $row.appendChild($td);
    }
    $tBody.appendChild($row);
  }
  return $tBody;
}

function resetDataCurrentCity() {
  data.currentCity = {
    cityId: null,
    cityObj: null,
    hasDetails: null,
    cityProfileUrl: null,
    cityName: null,
    cityArea: null,
    cityCountry: null,
    searchCardId: null,
    cityImageUrl: null,
    citySummary: null,
    cityPop: null,
    locations: null,
    costs: null,
    visitType: null,
    monthNum: null,
    rating: null,
    notes: [],

    cityImageAtt: {
      authorName: null,
      authorUrl: null
    },

    scores: {
      travel: null,
      safety: null,
      leisure: null,
      outdoors: null
    }
  };
}

function checkScore(div) {
  if (+div.getAttribute('aria-valuenow') > 6) {
    div.classList.add('bg-success');
  } else if (+div.getAttribute('aria-valuenow') > 3) {
    div.classList.add('bg-warning');
  } else {
    div.classList.add('bg-danger');
  }
}

function renderModalYears() {
  $modalYear.textContent = '';
  $modalMessage.textContent = '';
  if ($typeOfVisit.options[$typeOfVisit.selectedIndex].value === 'lived' || $typeOfVisit.options[$typeOfVisit.selectedIndex].value === 'visited' || $typeOfVisit.options[$typeOfVisit.selectedIndex].value === 'lives') {
    for (var y = 1990; y < 2023; y++) {
      var $yearOpt = document.createElement('option');
      $yearOpt.setAttribute('value', 'year' + y);
      $yearOpt.text = y;
      if (y === 2022) {
        $yearOpt.setAttribute('selected', true);
      }
      $modalYear.appendChild($yearOpt);
    }
  } else if ($typeOfVisit.options[$typeOfVisit.selectedIndex].value === 'willVisit') {
    for (var w = 2022; w < 2036; w++) {
      var $yearOpt2 = document.createElement('option');
      $yearOpt2.setAttribute('value', 'year' + w);
      $yearOpt2.text = w;
      if (w === 2022) {
        $yearOpt2.setAttribute('selected', true);
      }
      $modalYear.appendChild($yearOpt2);
    }
  }
}

function saveCitytoUserList() {
  var parenthesis = data.currentCity.cityArea.indexOf('(');
  data.currentCity.cityId = data.nextCityId;
  data.nextCityId++;
  if (parenthesis !== -1) {
    data.currentCity.cityCountry = data.currentCity.cityArea.substring((data.currentCity.cityArea.indexOf(',') + 2), parenthesis - 1);
  } else {
    data.currentCity.cityCountry = data.currentCity.cityArea.substring((data.currentCity.cityArea.indexOf(',') + 2));
  }
  var year = $visitYear.options[$visitYear.selectedIndex].textContent;
  data.currentCity.visitDate = new Date(year, $visitMonth.options[$visitMonth.selectedIndex].value);
  delete data.currentCity.searchCardId;
  data.currentCity.visitType = $typeOfVisit.options[$typeOfVisit.selectedIndex].value;
  var notInUserList = checkUserCities(data.currentCity.cityName, data.currentCity.visitType, data.currentCity.visitDate);
  if (notInUserList === true) {
    data.currentCity.visitType = $typeOfVisit.options[$typeOfVisit.selectedIndex].value;
    if (data.currentCity.visitType === 'lives') {
      data.hasLivingCity = true;
      $livesOption.setAttribute('disabled', true);
    }
    data.myEntries.push(data.currentCity);
    // var addCityModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('add-city-modal'));
    // addCityModal.hide();
    $addToMyCitiesModal.reset();
    $userCitiesList.textContent = '';
    renderMyCities();
    changeView('user-cities');
  }
}

function checkUserCities(cityName, type, date) {
  for (var e = 0; e < data.myEntries.length; e++) {
    if (cityName === data.myEntries[e].cityName && type === data.myEntries[e].visitType && date.getTime() === data.myEntries[e].visitDate.getTime()) {
      $modalMessage.textContent = 'This trip is already in your list.';
      return false;
    }
  }
  return true;
}

function renderMyCities() {
  $userCitiesList.textContent = '';
  for (var m = 0; m < data.myEntries.length; m++) {
    // <div class="card-wrapper text-start position-relative" data-city-id="idNumber">
    //   <i class="fa-solid fa-icon-name card-icon"></i>
    //   <p class="card-date mx-2">January 2022</p>
    //   <button class="x-btn float-end" type="button" data-bs-target="#remove-city-modal" data-bs-toggle="modal"><i class="fa-regular fa-circle-xmark fa-lg"></i></button>
    //   <div class="col-12 col-sm-4 col-md-3 my-1 d-flex user-card">
    //     <a href="#">
    //       <img class="card-img" src="../images/city-alt.jpg" alt="city-image">
    //       <h5 class="mt-3 cName">city name</h5>
    //       <p class="mx-3 text-nowrap text-center country-card">country</p>
    //     </a>
    //   </div>
    // </div>

    var $cardWrapper = document.createElement('div');
    var $travelIcon = document.createElement('i');
    var $cardDate = document.createElement('p');
    var $xBtn = document.createElement('button');
    var $xIcon = document.createElement('i');
    var $userCityCard = document.createElement('div');
    var $anchor = document.createElement('a');
    var $cardImg = document.createElement('img');
    var $cityNameTitle = document.createElement('h5');
    var $cityCardCountry = document.createElement('p');

    $cardWrapper.className = 'card-wrapper text-start position-relative';
    $cardWrapper.setAttribute('data-city-id', data.myEntries[m].cityId);
    if (data.myEntries[m].visitType === 'lives') {
      $travelIcon.className = 'fa-solid fa-house-chimney text-success';
    } else if (data.myEntries[m].visitType === 'lived') {
      $travelIcon.className = 'fa-solid fa-house-chimney';
    } else if (data.myEntries[m].visitType === 'visited') {
      $travelIcon.className = 'fa-solid fa-location-dot';
    } else if (data.myEntries[m].visitType === 'willVisit') {
      $travelIcon.className = 'fa-solid fa-plane';
    }

    $cardDate.className = 'card-date mx-2';
    var currentDate = new Date(data.myEntries[m].visitDate);
    $cardDate.textContent = currentDate.toLocaleString('en-US', { month: 'short' }) + ' ' + currentDate.getFullYear();
    $xBtn.className = 'x-btn float-end';
    $xBtn.setAttribute('type', 'button');
    $xBtn.setAttribute('data-bs-target', '#remove-city-modal');
    $xBtn.setAttribute('data-bs-toggle', 'modal');
    $xIcon.className = 'fa-regular fa-circle-xmark fa-lg';
    $userCityCard.className = 'col-12 col-sm-4 col-md-3 my-1 d-flex user-card';
    $anchor.setAttribute('href', '#');
    $cardImg.className = 'card-img';
    $cardImg.setAttribute('src', data.myEntries[m].cityImageUrl);
    $cardImg.setAttribute('alt', 'city-image');
    $cityNameTitle.className = 'mt-3 cName';
    $cityNameTitle.textContent = data.myEntries[m].cityName;
    $cityCardCountry.className = 'mx-3 text-nowrap text-center country-card';
    $cityCardCountry.textContent = data.myEntries[m].cityArea;

    $cardWrapper.appendChild($travelIcon);
    $cardWrapper.appendChild($cardDate);
    $xBtn.appendChild($xIcon);
    $cardWrapper.appendChild($xBtn);
    $cardWrapper.appendChild($userCityCard);
    $userCityCard.appendChild($anchor);
    $anchor.appendChild($cardImg);
    $anchor.appendChild($cityNameTitle);
    $anchor.appendChild($cityCardCountry);
    $userCitiesList.appendChild($cardWrapper);

    $xBtn.addEventListener('click', function (e) {
      data.editCity = event.target.closest('.card-wrapper');
      $removeCityDisplay.textContent = data.editCity.children[3].children[0].children[1].textContent + ', ' + data.editCity.children[3].children[0].children[2].textContent;
    });

    $cardWrapper.addEventListener('click', userCityClicked);
  }
}

function clearMessage() {
  $modalMessage.textContent = '';
}

function sortMyCities(event) {
  var entriesArray = data.myEntries;
  if (event.target.value === 'recent') {
    entriesArray = sortMostRecent(entriesArray);
  } else if (event.target.value === 'oldest') {
    entriesArray = sortOldest(entriesArray);
  } else if (event.target.value === 'city') {
    entriesArray = sortCityName(entriesArray);
  } else if (event.target.value === 'rev-city') {
    entriesArray = sortCityNameRev(entriesArray);
  } else if (event.target.value === 'country') {
    entriesArray = sortCountryName(entriesArray);
  } else if (event.target.value === 'rev-country') {
    entriesArray = sortCountryNameRev(entriesArray);
  }
  data.myEntries = entriesArray;
  $userCityHeader.textContent = '';
  $userCityDescription.textContent = '';
  $userCityAbout.textContent = '';
  $userCityScores.textContent = '';
  $userCityLeisureTable.textContent = '';
  $userCityCostTable.textContent = '';
  renderMyCities();
}

function sortMostRecent(array) {
  array = array.sort(function (a, b) {
    if (a.visitDate > b.visitDate) {
      return -1;
    } else if (a.visitDate < b.visitDate) {
      return 1;
    } else {
      return 0;
    }
  });
  return array;
}

function sortOldest(array) {
  array = array.sort(function (a, b) {
    if (a.visitDate < b.visitDate) {
      return -1;
    } else if (a.visitDate > b.visitDate) {
      return 1;
    } else {
      return 0;
    }
  });
  return array;
}

function sortCityName(array) {
  array = array.sort(function (a, b) {
    if (a.cityName.toLowerCase() > b.cityName.toLowerCase()) {
      return 1;
    } else if (a.cityName.toLowerCase() < b.cityName.toLowerCase()) {
      return -1;
    } else {
      return 0;
    }
  });
  return array;
}

function sortCityNameRev(array) {
  array = array.sort(function (a, b) {
    if (a.cityName.toLowerCase() < b.cityName.toLowerCase()) {
      return 1;
    } else if (a.cityName.toLowerCase() > b.cityName.toLowerCase()) {
      return -1;
    } else {
      return 0;
    }
  });
  return array;
}

function sortCountryName(array) {
  array = array.sort(function (a, b) {
    if (a.cityCountry.toLowerCase() > b.cityCountry.toLowerCase()) {
      return 1;
    } else if (a.cityCountry.toLowerCase() < b.cityCountry.toLowerCase()) {
      return -1;
    } else {
      return 0;
    }
  });
  return array;
}

function sortCountryNameRev(array) {
  array = array.sort(function (a, b) {
    if (a.cityCountry.toLowerCase() < b.cityCountry.toLowerCase()) {
      return 1;
    } else if (a.cityCountry.toLowerCase() > b.cityCountry.toLowerCase()) {
      return -1;
    } else {
      return 0;
    }
  });
  return array;
}

function deleteCity() {
  var $allUserCards = document.querySelectorAll('.card-wrapper');
  for (var c = 0; c < $allUserCards.length; c++) {
    for (var p = 0; p < data.myEntries.length; p++) {
      if ($allUserCards[c].getAttribute('data-city-id') === data.editCity.getAttribute('data-city-id') && data.myEntries[p].cityId === +data.editCity.getAttribute('data-city-id')) {
        data.myEntries.splice(p, 1);
        $allUserCards[c].remove();
      }
    }
  }
  // var deleteCityModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('remove-city-modal'));
  // deleteCityModal.hide();
}

function userCityClicked(event) {
  if (event.target.tagName !== 'I') {
    var card = event.target.closest('.card-wrapper');
    var id = +card.getAttribute('data-city-id');
    var clickedCity = null;
    for (var e = 0; e < data.myEntries.length; e++) {
      if (id === data.myEntries[e].cityId) {
        clickedCity = data.myEntries[e];
        data.editCity = data.myEntries[e];
      }
    }
    changeView('user-city-profile');
    renderImageAndTitle(clickedCity);
    renderUserCityDateAndReview(clickedCity);
    renderCityDescription(clickedCity);
    renderCityScores(clickedCity);
    renderLeisureTable(clickedCity);
    renderCostTable(clickedCity);
  }
}

function renderUserCityDateAndReview(city) {
  // <div class="col-12 mb-4">
  //   <p class="my-2">Visited in February 2019</p>
  //   <p class="w-100 mb-2">Rate Los Angeles</p>
  //   <div class="rating-stars mb-3">
  //     <img src="images/star-blank.svg" alt="rating-star" class="mx-1 star-icon" data-rating-id="0">
  //     <img src="images/star-blank.svg" alt="rating-star" class="mx-1 star-icon" data-rating-id="1">
  //     <img src="images/star-blank.svg" alt="rating-star" class="mx-1 star-icon" data-rating-id="2">
  //     <img src="images/star-blank.svg" alt="rating-star" class="mx-1 star-icon" data-rating-id="3">
  //     <img src="images/star-blank.svg" alt="rating-star" class="mx-1 star-icon" data-rating-id="4">
  //   </div>
  //   <button type="button" class="btn add-btn col-12" data-bs-target="#add-modal" data-bs-toggle="modal">ADD NOTE</button>
  // </div>

  var $descCol = document.createElement('div');
  var $visitDate = document.createElement('p');
  var $descRateTitle = document.createElement('p');
  var $ratingContainer = document.createElement('div');
  var $addNoteBtn = document.createElement('button');

  for (var s = 0; s < 5; s++) {
    var $star = document.createElement('img');
    $star.setAttribute('alt', 'rating-star');
    $star.setAttribute('data-rating-id', s);
    $star.className = 'mx-1 star-icon';

    if (city.rating > s) {
      $star.setAttribute('src', 'images/star-filled.svg');
    } else {
      $star.setAttribute('src', 'images/star-blank.svg');
    }
    $ratingContainer.appendChild($star);
  }

  $ratingContainer.addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG') {
      var id = event.target.getAttribute('data-rating-id');
      city.rating = +id + 1;
      starRating(id);
    }
  });

  $descCol.className = 'col-12 mb-3';
  $visitDate.className = 'my-2 visit-date';
  var cityDate = new Date(city.visitDate);
  $visitDate.textContent = 'Visited in ' + cityDate.toLocaleString('default', { month: 'long' }) + ' ' + cityDate.getFullYear();
  $descRateTitle.className = 'w-100 mb-2';
  $descRateTitle.textContent = 'Rate ' + city.cityName;
  $addNoteBtn.setAttribute('type', 'button');
  $addNoteBtn.className = 'btn add-btn col-12 mt-3';
  $addNoteBtn.setAttribute('data-bs-target', '#add-note-modal');
  $addNoteBtn.setAttribute('data-bs-toggle', 'modal');
  $addNoteBtn.textContent = 'ADD NOTE';

  $descCol.appendChild($visitDate);
  $descCol.appendChild($descRateTitle);
  $descCol.appendChild($ratingContainer);
  $descCol.appendChild($addNoteBtn);
  $userCityDescription.appendChild($descCol);
}

function starRating(id) {
  var $allStars = document.querySelectorAll('.star-icon');
  for (var r = 0; r < $allStars.length; r++) {
    if (r <= id) {
      $allStars[r].setAttribute('src', 'images/star-filled.svg');
    } else {
      $allStars[r].setAttribute('src', 'images/star-blank.svg');
    }
  }
}

function updateChevron(event) {
  var $anchor = event.target.closest('.collapse-head');
  if ($anchor.getAttribute('aria-expanded') === 'true') {
    $anchor.firstElementChild.className = 'fa-solid fa-lg fa-chevron-down';
  } else {
    $anchor.firstElementChild.className = 'fa-solid fa-lg fa-chevron-left';
  }
}

function addNotesClickedBtn(event) {
  var note = {};
  if ($noteTitle.value === '' || $noteMessage.vale === '') {
    return;
  }
  note.title = $noteTitle.value;
  note.message = $noteMessage.value;
  data.editCity.notes.push(note);
  renderNotes(data.editCity);
  $addNotesModal.reset();
  // var addNoteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('add-note-modal'));
  // addNoteModal.hide();
}

function renderNotes(city) {
  // <a class="note-collapse-btn collapse-head p-2 col-12 position-relative" href="#user-city-note"
  //    data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="user-city-note">
  //    TITLE <i class="fa-solid fa-lg fa-chevron-left"></i>
  // </a>
  // <div class="w-100 collapse col-12 note" id="user-city-note">
  //    <div class="px-3 align-items-center text-center user-city-note">
  //      MESSAGE
  //    </div>
  // </div>
  $notesSection.textContent = '';
  for (var n = 0; n < city.notes.length; n++) {
    var $noteHead = document.createElement('a');
    var $noteChevron = document.createElement('i');
    var $noteBody = document.createElement('div');
    var $noteMessage = document.createElement('div');

    $noteHead.className = 'note-collapse-btn collapse-head p-2 col-12 position-relative';
    $noteHead.setAttribute('href', '#user-city-note' + n);
    $noteHead.setAttribute('data-bs-toggle', 'collapse');
    $noteHead.setAttribute('role', 'button');
    $noteHead.setAttribute('aria-expanded', 'false');
    $noteHead.setAttribute('aria-controls', 'user-city-note' + n);
    $noteHead.textContent = data.editCity.notes[n].title;
    $noteChevron.className = 'fa-solid fa-lg fa-chevron-left';
    $noteBody.className = 'w-100 collapse col-12 note';
    $noteBody.setAttribute('id', 'user-city-note' + n);
    $noteMessage.className = 'px-3 align-items-center text-center user-city-note';
    $noteMessage.textContent = data.editCity.notes[n].message;

    $noteHead.appendChild($noteChevron);
    $noteBody.appendChild($noteMessage);
    $notesSection.appendChild($noteHead);
    $notesSection.appendChild($noteBody);
  }
}

renderMyCities();
