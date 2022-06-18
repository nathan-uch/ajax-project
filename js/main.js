var $searchCity = document.forms[0];
var $searchBox = document.querySelector('.searchbox');
var $searchResultsRow = document.querySelector('.search-results-row');
var $dataView = document.querySelectorAll('[data-view]');
var $searchCitiesAnchor = document.querySelector('.search-cities-anchor');
var $cityProfileImg = document.querySelector('.profile-img');
var $cityProfileDesc = document.querySelector('.profile-desc');
var $cityScoresContainer = document.querySelector('.scores-container');
var $cityLocationsContainer = document.querySelector('.profile-leisure');
var $cityCostsContainer = document.querySelector('.profile-costs');
var $cityFooterContainer = document.querySelector('.profile-footer');
var $modalYear = document.querySelector('#year');

$searchCity.addEventListener('submit', getSearchResults);
$searchResultsRow.addEventListener('click', saveCityInfo);
$searchCitiesAnchor.addEventListener('click', switchNavbarPage);

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
    //    <a href="#" class="searched-card">
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
    $cityCard.className = 'searched-card';
    $cityName.textContent = city;
    $countryName.textContent = country;

    $cityCard.appendChild($cityName);
    $cityCard.appendChild($countryName);
    $column.appendChild($cityCard);
    $searchResultsRow.appendChild($column);
  }
}

function saveCityInfo(event) {
  resetDataCurrentCity();

  if (event.target.closest('.city-card') !== null) {
    data.currentCity.cityId = event.target.closest('.city-card').getAttribute('data-card-id');
    data.currentCity.cityObj = data.searchResults._embedded['city:search-results'][data.currentCity.cityId];
    changeView('city-profile');
    getCityData();
  }
}

function changeView(view) {
  data.currentView = view;
  for (var v = 0; v < $dataView.length; v++) {
    if ($dataView[v].getAttribute('data-view') === data.currentView && data.currentView === 'city-profile') {
      $cityProfileImg.textContent = '';
      $cityProfileDesc.textContent = '';
      $cityScoresContainer.textContent = '';
      $cityLocationsContainer.textContent = '';
      $cityCostsContainer.textContent = '';
      $cityFooterContainer.textContent = '';
      $dataView[v].classList.remove('hidden');
    } else if ($dataView[v].getAttribute('data-view') === data.currentView) {
      $dataView[v].classList.remove('hidden');
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
  data.currentCity.cityCountry = fullName.splice(countryIndex, fullName.length - 1).join('');

  var currentCityProfileUrl = data.currentCity.cityObj._links['city:item'].href;
  data.currentCity.cityProfileUrl = currentCityProfileUrl;

  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', currentCityProfileUrl);
  xhr2.reponseType = 'json';
  xhr2.addEventListener('load', function () {
    var result2Result = JSON.parse(xhr2.response);
    data.currentCity.cityPop = result2Result.population.toLocaleString();
    if (!result2Result._links['city:urban_area']) {
      data.currentCity.citySummary = 'Sorry, there are no details about this city.';
      data.currentCity.cityImageUrl = '../images/city-alt.jpg';
      data.currentCity.cityImageAtt.authorName = 'Rafael De Nadai';
      data.currentCity.cityImageAtt.authorUrl = 'https://tinyurl.com/4udjv35y';
      renderImage();
      renderCityDescription();
      renderFooter();
    } else {
      if (result2Result._links['city:urban_area'] === undefined) {
        data.currentCity.cityImageUrl = '../images/city-alt.jpg';
        data.currentCity.cityImageAtt.authorName = 'Rafael De Nadai';
        data.currentCity.cityImageAtt.authorUrl = 'https://tinyurl.com/4udjv35y';
        renderImage();
        renderCityDescription();
        renderFooter();
      } else {
        // GET IMAGE
        var slugUrl = result2Result._links['city:urban_area'].href + 'images';
        var xhr3 = new XMLHttpRequest();
        xhr3.open('GET', slugUrl);
        xhr3.responseType = 'json';
        xhr3.addEventListener('load', function () {
          var xhr3Result = xhr3.response;
          data.currentCity.cityImageUrl = xhr3Result.photos[0].image.web;
          data.currentCity.cityImageAtt.authorName = xhr3Result.photos[0].attribution.photographer;
          data.currentCity.cityImageAtt.authorUrl = xhr3Result.photos[0].attribution.source;
          renderImage();
          renderFooter();
        });
        xhr3.send();
        // GET DESCRIPTION
        var scoresUrl = result2Result._links['city:urban_area'].href + 'scores/';
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
          renderCityDescription();
          renderCityScores();
        });
        xhr4.send();

        // GET TABLE DETAILS
        var detailsUrl = result2Result._links['city:urban_area'].href + 'details/';
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
          renderLeisureTable();

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
          renderCostTable();
        });
        xhr5.send();
      }
    }
  });
  xhr2.send();
  renderModalYears();
}

function renderImage() {
  // <div class="col d-flex flex-wrap align-items-center my-4">
  //   <figure>
  //     <img src="" class="img-fluid" alt="city">
  //     <figcaption><a class="caption" href="">Author</a></figcaption>
  //   </figure>
  // </div>

  var $imgCol = document.createElement('div');
  var $figure = document.createElement('figure');
  var $img = document.createElement('img');
  var $figCap = document.createElement('figcapture');
  var $authorLink = document.createElement('a');

  $imgCol.className = 'col d-flex flex-wrap align-items-center my-4';
  $img.className = 'img-fluid';
  $img.setAttribute('src', data.currentCity.cityImageUrl);
  $authorLink.className = 'caption';
  $authorLink.setAttribute('href', data.currentCity.cityImageAtt.authorUrl);
  $authorLink.textContent = 'Photo by: ' + data.currentCity.cityImageAtt.authorName;

  $imgCol.appendChild($figure);
  $figure.appendChild($img);
  $figure.appendChild($figCap);
  $figCap.appendChild($authorLink);
  $cityProfileImg.appendChild($imgCol);
}

function renderCityDescription() {
  // <div class="col align-items-center text-center">
  //   <h2>city name</h2>
  //   <p>country<p><br>
  //   <button type="button" class="btn add-city-btn col-12" data-bs-target="#add-city-modal" data-bs-toggle="modal">ADD CITY TO LIST</button></br>
  //   <p>description<p></br>
  //   <p>total pop</p>
  // </div>

  var $descCol = document.createElement('div');
  var $cityName = document.createElement('h2');
  var $cityCountry = document.createElement('p');
  var $addCityBtn = document.createElement('button');
  var $cityDesc = document.createElement('p');
  var $pop = document.createElement('p');
  var $br1 = document.createElement('br');
  var $br2 = document.createElement('br');

  $descCol.className = 'col align-items-center text-center';
  $cityName.textContent = data.currentCity.cityName;
  $cityCountry.textContent = data.currentCity.cityCountry;
  $addCityBtn.setAttribute('type', 'button');
  $addCityBtn.setAttribute('data-bs-target', '#add-city-modal');
  $addCityBtn.setAttribute('data-bs-toggle', 'modal');

  $addCityBtn.className = 'btn add-city-btn col-12';
  $addCityBtn.textContent = 'ADD CITY TO LIST';
  $cityDesc.textContent = '';
  $cityDesc.textContent = data.currentCity.citySummary;
  $pop.textContent = 'Estimated Population: ' + data.currentCity.cityPop;

  $descCol.appendChild($cityName);
  $descCol.appendChild($cityCountry);
  $descCol.appendChild($br1);
  $descCol.appendChild($addCityBtn);
  $descCol.appendChild($cityDesc);
  $descCol.appendChild($br2);
  $descCol.appendChild($pop);
  $cityProfileDesc.appendChild($descCol);
}

function renderCityScores() {
// <div class="row profile-travel-scores my-4">
//    <div class="col align-items-center text-center">
//      <h3>Travel Scores</h3>
//      <p>Travel Connectivity #/10</p>
//      <div class="progress">
//        <div class="progress-bar bg-warning travel-score" role="progressbar"
//            aria-valuenow="#" aria-valuemin="0" aria-valuemax="10"></div>
//      </div>
//      <p>Safety #/10</p>
//      <div class="progress">
//        <div class="progress-bar bg-warning safety-score" role="progressbar" aria-valuenow="#"
//          aria-valuemin="0" aria-valuemax="10">
//        </div>
//      </div>
//      <p>Leisure and Culture #/10</p>
//      <div class="progress">
//        <div class="progress-bar bg-success leisure-score" role="progressbar" aria-valuenow="#"
//            aria-valuemin="0" aria-valuemax="10">
//        </div>
//      </div>
//      <p>Outdoors #/10</p>
//      <div class="progress">
//        <div class="progress-bar bg-success outdoors-score" role="progressbar" aria-valuenow="#"
//           aria-valuemin="0" aria-valuemax="10">
//        </div>
//      </div>
//    </div >
// </div>

  var $scoresRow = document.createElement('div');
  var $scoresCol = document.createElement('div');
  var $scoreHeader = document.createElement('h3');
  var $travelHead = document.createElement('p');
  var $travelProg = document.createElement('div');
  var $travelScore = document.createElement('div');
  var $safetyHead = document.createElement('p');
  var $safetyProg = document.createElement('div');
  var $safetyScore = document.createElement('div');
  var $leisureHead = document.createElement('p');
  var $leisureProg = document.createElement('div');
  var $leisureScore = document.createElement('div');
  var $outdoorHead = document.createElement('p');
  var $outdoorProg = document.createElement('div');
  var $outdoorsScore = document.createElement('div');

  $scoresRow.className = 'row profile-travel-scores my-4';
  $scoresCol.className = 'col align-items-center text-center';
  $travelProg.className = 'progress';
  $safetyProg.className = 'progress';
  $leisureProg.className = 'progress';
  $outdoorProg.className = 'progress';
  $scoreHeader.textContent = 'Travel Scores';
  $travelScore.className = 'progress-bar travel-score';
  $travelScore.style.width = (data.currentCity.scores.travel * 10) + '%';
  $travelHead.textContent = 'Travel Connectivity ' + data.currentCity.scores.travel + '/10';
  $travelScore.setAttribute('role', 'progressbar');
  $travelScore.setAttribute('aria-valuenow', data.currentCity.scores.travel);
  $travelScore.setAttribute('aria-valuemin', '0');
  $travelScore.setAttribute('aria-valuemax', '10');
  checkScore($travelScore);

  $safetyScore.className = 'progress-bar safety-score';
  $safetyScore.style.width = (data.currentCity.scores.safety * 10) + '%';
  $safetyHead.textContent = 'Safety ' + data.currentCity.scores.safety + '/10';
  $safetyScore.setAttribute('role', 'progressbar');
  $safetyScore.setAttribute('aria-valuenow', data.currentCity.scores.safety);
  $safetyScore.setAttribute('aria-valuemin', '0');
  $safetyScore.setAttribute('aria-valuemax', '10');
  checkScore($safetyScore);

  $leisureScore.className = 'progress-bar leisure-score';
  $leisureScore.style.width = (data.currentCity.scores.leisure * 10) + '%';
  $leisureHead.textContent = 'Leisure and Culture ' + data.currentCity.scores.leisure + '/10';
  $leisureScore.setAttribute('role', 'progressbar');
  $leisureScore.setAttribute('aria-valuenow', data.currentCity.scores.leisure);
  $leisureScore.setAttribute('aria-valuemin', '0');
  $leisureScore.setAttribute('aria-valuemax', '10');
  checkScore($leisureScore);

  $outdoorsScore.className = 'progress-bar outdoors-score';
  $outdoorsScore.style.width = (data.currentCity.scores.outdoors * 10) + '%';
  $outdoorHead.textContent = 'Outdoors ' + data.currentCity.scores.outdoors + '/10';
  $outdoorsScore.setAttribute('role', 'progressbar');
  $outdoorsScore.setAttribute('aria-valuenow', data.currentCity.scores.outdoors);
  $outdoorsScore.setAttribute('aria-valuemin', '0');
  $outdoorsScore.setAttribute('aria-valuemax', '10');
  checkScore($outdoorsScore);

  $scoresRow.appendChild($scoresCol);
  $scoresCol.appendChild($scoreHeader);
  $scoresCol.appendChild($travelHead);
  $scoresCol.appendChild($travelProg);
  $travelProg.appendChild($travelScore);
  $scoresCol.appendChild($safetyHead);
  $scoresCol.appendChild($safetyProg);
  $safetyProg.appendChild($safetyScore);
  $scoresCol.appendChild($leisureHead);
  $scoresCol.appendChild($leisureProg);
  $leisureProg.appendChild($leisureScore);
  $scoresCol.appendChild($outdoorHead);
  $scoresCol.appendChild($outdoorProg);
  $outdoorProg.appendChild($outdoorsScore);
  $cityScoresContainer.appendChild($scoresRow);
}

function renderLeisureTable() {
  //   <div class="col align-items-center text-center table-container">
  //     <table class="table table-hover w-100 m-auto">
  //       <thead>
  //         <tr>
  //           <th scope="col">Category</th>
  //           <th scope="col">Amount</th>
  //           <th scope="col">Score</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr> * 6
  //           <td>leisure location</td>
  //           <td>num</td>
  //           <td>score</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>

  var $leiSectionCol = document.createElement('div');
  var $leiTable = document.createElement('table');
  var $leiTHead = document.createElement('thead');
  var $headRow = document.createElement('tr');
  var $th1 = document.createElement('th');
  var $th2 = document.createElement('th');
  var $th3 = document.createElement('th');

  $leiSectionCol.className = 'col align-items-center text-center table-container';
  $leiTable.className = 'table table-hover w-100 m-auto';
  $th1.setAttribute('scope', 'col');
  $th1.textContent = 'Category';
  $th2.setAttribute('scope', 'col');
  $th2.textContent = 'Amount';
  $th3.setAttribute('scope', 'col');
  $th3.textContent = 'Score';

  $leiSectionCol.appendChild($leiTable);
  $leiTable.appendChild($leiTHead);
  $leiTHead.appendChild($headRow);
  $headRow.appendChild($th1);
  $headRow.appendChild($th2);
  $headRow.appendChild($th3);
  $leiTable.appendChild(renderTableData(data.currentCity.locations));
  $cityLocationsContainer.appendChild($leiSectionCol);
}

function renderCostTable() {
  //   <div class="col align-items-center text-center table-container">
  //     <table class="table table-hover w-100 m-auto">
  //       <thead>
  //         <tr>
  //           <th scope="col">Category</th>
  //           <th scope="col">Average Cost</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr> * 5
  //           <td>category</td>
  //           <td>cost</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>

  var $costSectionCol = document.createElement('div');
  var $costTable = document.createElement('table');
  var $costTHead = document.createElement('thead');
  var $headRow = document.createElement('tr');
  var $th1 = document.createElement('th');
  var $th2 = document.createElement('th');

  $costSectionCol.className = 'col align-items-center text-center table-container';
  $costTable.className = 'table table-hover w-100 m-auto';
  $th1.setAttribute('scope', 'col');
  $th1.textContent = 'Category';
  $th2.setAttribute('scope', 'col');
  $th2.textContent = 'Average Cost';

  $costSectionCol.appendChild($costTable);
  $costTable.appendChild($costTHead);
  $costTHead.appendChild($headRow);
  $headRow.appendChild($th1);
  $headRow.appendChild($th2);
  $costTable.appendChild(renderTableData(data.currentCity.costs));
  $cityCostsContainer.appendChild($costSectionCol);
}

function renderFooter() {
  // <button class="btn add-city-btn" type="button" data-bs-target="#add-city-modal" data-bs-toggle="modal">ADD CITY TO LIST</button>
  // <a href="#" class="back-top">Back to Top</a>

  var $addCityBtn = document.createElement('button');
  var $backTop = document.createElement('a');

  $addCityBtn.className = 'btn add-city-btn';
  $addCityBtn.setAttribute('type', 'button');
  $addCityBtn.setAttribute('data-bs-target', '#add-city-modal');
  $addCityBtn.setAttribute('data-bs-toggle', 'modal');
  $addCityBtn.setAttribute('type', 'button');

  $addCityBtn.textContent = 'ADD CITY TO LIST';
  $backTop.setAttribute('href', '#');
  $backTop.className = 'back-top';
  $backTop.textContent = 'Back to Top';

  $cityFooterContainer.appendChild($addCityBtn);
  $cityFooterContainer.appendChild($backTop);
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
  data.myEntries.push(data.currentCity);
  data.currentCity = {
    cityObj: null,
    cityProfileUrl: null,
    cityName: null,
    cityCountry: null,
    cityId: null,
    cityImageUrl: null,
    citySummary: null,
    cityPop: null,
    locations: null,
    costs: null,
    hasDetails: null,

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
  for (var y = 1990; y < 2031; y++) {
    var $yearOpt = document.createElement('option');
    $yearOpt.setAttribute('value', 'year' + y);
    $yearOpt.text = y;
    $modalYear.appendChild($yearOpt);
  }
}
