/* exported data */

var data = {
  majorCities: null,
  currentView: null,
  searchResults: null,
  nextCityId: 0,
  currentCity: {
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
    latlon: {},
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
  },
  hasLivingCity: null,
  editCity: null,
  myEntries: []
};

window.addEventListener('beforeunload', function () {
  const userEntries = JSON.stringify(data.myEntries);
  this.localStorage.setItem('user-entries-local-storage', userEntries);

  const currentCityId = JSON.stringify(data.nextCityId);
  this.localStorage.setItem('current-city-id-local-storage', currentCityId);
});
