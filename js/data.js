/* exported data */

var data = {
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
    visitDate: null,
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
  },
  hasLivingCity: null,
  editCity: null,
  myEntries: [
    {
      cityId: 0,
      cityObj: {
        _links: {
          'city:item': {
            href: 'https://api.teleport.org/api/cities/geonameid:1850147/'
          }
        },
        matching_alternate_names: [
          {
            name: 'twqyw'
          },
          {
            name: 'tokkiyo'
          },
          {
            name: 'tokeiyw'
          },
          {
            name: 'Tokyo'
          },
          {
            name: 'tokyo'
          },
          {
            name: 'Toquio - 東京'
          },
          {
            name: 'Tokio'
          },
          {
            name: 'Tokió'
          },
          {
            name: 'TYO'
          },
          {
            name: 'Tokjo'
          },
          {
            name: 'Toquio - dong jing'
          },
          {
            name: 'Tokija'
          },
          {
            name: 'Tōkyō'
          },
          {
            name: 'Tochiu'
          },
          {
            name: 'Toquio'
          },
          {
            name: 'Tocio'
          },
          {
            name: 'Tokijas'
          },
          {
            name: 'Tóquio'
          },
          {
            name: 'twkyw'
          },
          {
            name: 'Tókýó'
          },
          {
            name: 'Tòquio'
          }
        ],
        matching_full_name: 'Tokyo, Tokyo, Japan'
      },
      hasDetails: true,
      cityProfileUrl: 'https://api.teleport.org/api/cities/geonameid:1850147/',
      cityName: 'Tokyo',
      cityArea: 'Tokyo, Japan',
      cityCountry: 'Japan',
      cityImageUrl: 'https://d13k13wj6adfdf.cloudfront.net/urban_areas/tokyo_web-7a20b5733f.jpg',
      citySummary: '\n    Tokyo is one of the most vibrant and modern cities in the world. It provides a wide range of opportunities from recreational activities to job offers, and is therefore an appealing choice for people looking for a change. When it comes to food, you are spoiled with choices: there are more restaurants than you could visit in your lifetime. It is also a relatively green city, as 3.6% of Tokyo is covered by parks and forests, and, despite its size, it is still among the safest cities in the world.\n\n\n\n    Tokyo is one of the top ten city matches for 8.5% of Teleport users.\n',
      cityPop: '8,336,599',
      locations: null,
      costs: null,
      visitType: 'visited',
      monthNum: null,
      notes: [],
      cityImageAtt: {
        authorName: 'Wilhelm Joys Andersen',
        authorUrl: 'http://commons.wikimedia.org/wiki/File:Tokyo_Tower_and_surrounding_area.jpg'
      },
      scores: {
        travel: 8,
        safety: 10,
        leisure: 9,
        outdoors: 7
      },
      visitDate: '2022-01-01T08:00:00.000Z'
    },
    {
      cityId: 1,
      cityObj: {
        _links: {
          'city:item': {
            href: 'https://api.teleport.org/api/cities/geonameid:3173435/'
          }
        },
        matching_alternate_names: [
          {
            name: 'MIL'
          },
          {
            name: 'Milano'
          },
          {
            name: 'Milanas'
          },
          {
            name: 'milani'
          },
          {
            name: 'Milao'
          },
          {
            name: 'Milan'
          },
          {
            name: 'Milana'
          },
          {
            name: 'mi lan'
          },
          {
            name: 'Mila'
          },
          {
            name: 'Milánó'
          },
          {
            name: 'Milaan'
          },
          {
            name: 'Milà'
          },
          {
            name: 'millano'
          },
          {
            name: 'Milán'
          },
          {
            name: 'Milão'
          },
          {
            name: 'milan'
          },
          {
            name: 'Milanu'
          },
          {
            name: 'mirano'
          },
          {
            name: 'Milāna'
          },
          {
            name: 'Miláno'
          }
        ],
        matching_full_name: 'Milan, Lombardy, Italy'
      },
      hasDetails: true,
      cityProfileUrl: 'https://api.teleport.org/api/cities/geonameid:3173435/',
      cityName: 'Milan',
      cityArea: 'Lombardy, Italy',
      cityCountry: 'Italy',
      cityImageUrl: 'https://d13k13wj6adfdf.cloudfront.net/urban_areas/milan_web-b92932c77a.jpg',
      citySummary: 'Milan, Italy, features a wide variety of free time activities.\n\n    \n        According to our city rankings, this is a good place to live with high ratings in travel connectivity, safety and healthcare.\n    \n\n    \n\n\n\n    Milan is one of the top ten city matches for 0.1% of Teleport users.\n',
      cityPop: '1,236,837',
      locations: [
        {
          name: 'Art Galleries',
          num: 94,
          score: 0.81
        },
        {
          name: 'Cinemas',
          num: 167,
          score: 0.62
        },
        {
          name: 'Comedy Clubs',
          num: 92,
          score: 0.86
        },
        {
          name: 'Concert Venues',
          num: 188,
          score: 0.75
        },
        {
          name: 'Historical Sites',
          num: 175,
          score: 0.83
        },
        {
          name: 'Museums',
          num: 91,
          score: 0.76
        }
      ],
      costs: [
        {
          name: 'Restaurant Lunch',
          cost: '$18'
        },
        {
          name: 'Monthly Public Transport',
          cost: '$41'
        },
        {
          name: 'Beer',
          cost: '$2'
        },
        {
          name: 'Movie Tickets',
          cost: '$12'
        },
        {
          name: 'Apples (kg)',
          cost: '$2.6'
        }
      ],
      visitType: 'visited',
      monthNum: null,
      notes: [],
      cityImageAtt: {
        authorName: 'lolsanches',
        authorUrl: 'http://pixabay.com/en/milan-piazza-duomo-italy-422951/'
      },
      scores: {
        travel: 7,
        safety: 7,
        leisure: 8,
        outdoors: 6
      },
      visitDate: '2013-06-01T07:00:00.000Z'
    },
    {
      cityId: 2,
      cityObj: {
        _links: {
          'city:item': {
            href: 'https://api.teleport.org/api/cities/geonameid:3435910/'
          }
        },
        matching_alternate_names: [
          {
            name: 'Gorad Buehnas-Ajrehs'
          }
        ],
        matching_full_name: 'Buenos Aires, Buenos Aires F.D., Argentina (Gorad Buehnas-Ajrehs)'
      },
      hasDetails: true,
      cityProfileUrl: 'https://api.teleport.org/api/cities/geonameid:3435910/',
      cityName: 'Buenos Aires',
      cityArea: 'Buenos Aires F.D., Argentina (Gorad Buehnas-Ajrehs)',
      cityCountry: 'Argentina',
      cityImageUrl: 'https://d13k13wj6adfdf.cloudfront.net/urban_areas/buenos-aires_web-17f0020100.jpg',
      citySummary: 'Buenos Aires, Argentina, is characterized by reasonably priced housing.\n\n    \n        According to our city rankings, this is a good place to live with high ratings in cost of living, leisure & culture and tolerance.\n    \n\n    \n\n\n\n    Buenos Aires is one of the top ten city matches for 1.9% of Teleport users.\n',
      cityPop: '13,076,300',
      locations: null,
      costs: null,
      visitType: 'willVisit',
      monthNum: null,
      notes: [],
      cityImageAtt: {
        authorName: 'Luis Argerich',
        authorUrl: 'http://commons.wikimedia.org/wiki/File:Congress_Plaza,_Buenos_Aires_at_Sunset.jpg'
      },
      scores: {
        travel: 4,
        safety: 6,
        leisure: 8,
        outdoors: 5
      },
      visitDate: '2024-10-01T07:00:00.000Z'
    }
  ]
};
