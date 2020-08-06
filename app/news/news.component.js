'use strict';

  app.component('news', {
  templateUrl: "news/news.template.html",
  controller: function($scope, $rootScope, request) {
    $rootScope.count;
    $scope.lastIndex = 3;
    $scope.data = [];

    var query = {
      url: 'getPostsCount'
    }
    request.query(query, 'GET').then(function(res) {
      $rootScope.count = res.data.count;
    });

    $scope.loadMore = function() {
      getPostsPaginated();
    }

    var getPostsPaginated = function() {
      var query = {
        url: 'getPosts?s='+$scope.lastIndex+'&e='+($scope.lastIndex+6)
      }

      $scope.lastIndex += 6;

      request.query(query, 'GET').then(function(res) {
        $scope.data = $scope.data.concat(res.data);
      });
    }

    getPostsPaginated();
  }
});