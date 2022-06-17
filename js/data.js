/* exported data */

var data = {
  currentView: null,
  searchResults: null,
  currentCity: {
    cityObj: null,
    cityProfileUrl: null,
    cityName: null,
    cityCountry: null,
    cityId: null,
    cityImageUrl: null,
    cityImageAtt: {
      authorName: null,
      authorUrl: null
    },
    citySummary: null,
    cityPop: null,
    popDensity: null,
    scores: {
      travelConnectivity: null,
      safety: null,
      leisure: null,
      outdoors: null
    },
    locations: [
      {
        artGalleries: null,
        score: null
      },
      {
        cinemas: null,
        score: null
      },
      {
        comedyClubs: null,
        score: null
      },
      {
        concertVenues: null,
        score: null
      },
      {
        historicalSites: null,
        score: null
      }
    ],
    costs: {
      publicTransport: null,
      restaurantLunc: null,
      beer: null,
      movieTicket: null
    }
  },
  myEntries: []
};
