'use strict';

  app.component('postAdd', {
  templateUrl: "blogpost/post.template.html",
  controller: function($scope, $rootScope, request, $window, $http) {

    $scope.add = true;

    $scope.data = {
      date: new Date(),
      title: '',
      image: '',
      content: ''
    }

    var query = {
      url: 'getPostsCount'
    }
    request.query(query, 'GET').then(function(res) {
      $rootScope.count = res.data.count;
    });

    $scope.save = function() {
      if ('' == $scope.data.title
        && '' == $scope.data.image
        && '' == $scope.data.content) {
        $window.location.href = '#/';
        return;
      }

      var query = {
        url: 'savePost?new=true',
        data: {
          'title': $scope.data.title,
          'image': $scope.data.image,
          'content': $scope.data.content,
          'id': ++$rootScope.count
        }
      }
      request.query(query, 'POST').then(function(res) {
        $window.location.href = '#/post/'+query.data.id;
      });
    }

    $scope.cancel = function() {
      if ('' != $scope.data.title
        || '' != $scope.data.image
        || '' != $scope.data.content) {
        if (confirm("Some contents are updated. Do you wish to continue?")) {
          $window.location.href = '#/';
        } else {
          return;
        }
      }

      $window.location.href = '#/';
    }

    $scope.uploadImage = function (files) {
        var file = files[0];

        var uploadUrl = "upload";

        var fd = new FormData();
         fd.append('file', file);

         $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
         })

         .success(function(){
          $scope.data.image = 'img/'+file.name;
         })

         .error(function(){
         });
    }

  }
});