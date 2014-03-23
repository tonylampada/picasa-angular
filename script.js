// Code goes here

// Code goes here

'use strict';
var app = angular.module('app', [])

app.directive('picasa', ['picasaService', function() {
    return {
      restrict: 'E',
      scope: {
        url: '@'
      },
      controller: function($scope, picasaService){
        $scope.photos = picasaService.get($scope.url).then(function(photos){
          $scope.photos = photos;
        })

      },
      templateUrl: 'photoBlock.html'
    };
  }
]);

app.factory('picasaService', ['$http', '$q', function($http, $q) {
  // Service logic

  $http.defaults.useXDomain = true;

  function parsePhoto(entry) {
    var photo = {
      url: entry.media$group.media$content[0].url
    };
    return photo;
  }

  function parsePhotos(url) {
    var d = $q.defer();
    var photo;
    var photos = [];
    loadPhotos(url).then(function(data) {
      if (!data.feed) {
        photos.push(parsePhoto(data.entry));
      } else {
        var entries = data.feed.entry;
        for (var i = 0; i < entries.length; i++) {
          photos.push(parsePhoto(entries[i]));
        }
      }
      d.resolve(photos);

    });
    return d.promise;
  }

  function loadPhotos(url) {
    var d = $q.defer();
    $http.jsonp(url + '?alt=json&kind=photo&hl=pl&imgmax=912&callback=JSON_CALLBACK').success(function(data, status) {
      d.resolve(data);
    });
    return d.promise;
  }

  // Public API here
  return {
    get : function (url) {
      return parsePhotos(url);
    }
  };
}]);
