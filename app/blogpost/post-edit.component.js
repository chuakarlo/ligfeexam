'use strict';

  app.component('postEdit', {
  templateUrl: "blogpost/post.template.html",
  controller: function($scope, $routeParams, $http, request, $window) {
    $scope.comment = {
      content: ""
    };
    $scope.edit = true;

    var curr_data = null;

    var query = {
      url: 'getPost?postId='+$routeParams.postId
    }
    request.query(query, 'GET').then(function(res) {
      $scope.data = res.data;
      curr_data = Object.assign({}, res.data);

      $scope.data.comments.forEach(function(item) {
        item.date = checkDate(item.date);
      });
    });

    $scope.save = function() {
      if (curr_data.title == $scope.data.title
        && curr_data.image == $scope.data.image
        && curr_data.content == $scope.data.content) {
        $window.location.href = '#/post/'+$scope.data.id;
        return;
      }

      var query = {
        url: 'savePost',
        data: {
          'title': $scope.data.title,
          'image': $scope.data.image,
          'content': $scope.data.content,
          'id': $scope.data.id
        }
      }
      request.query(query, 'POST').then(function(res) {
        $window.location.href = '#/post/'+$scope.data.id;
      });
    }

    $scope.cancel = function() {
      if (curr_data.title != $scope.data.title
        || curr_data.image != $scope.data.image
        || curr_data.content != $scope.data.content) {
        if (confirm("Some contents are updated. Do you wish to continue?")) {
          $window.location.href = '#/post/'+$scope.data.id;
        } else {
          return;
        }
      }

      $window.location.href = '#/post/'+$scope.data.id;
    }

    $scope.submitComment = function() {
      var query = {
        url: 'addComment?postId='+$routeParams.postId,
        data: $scope.comment.content
      }

      request.query(query, 'POST').then(function(res) {
        let comments = [];

        res.data.date = checkDate(res.data.date);

        comments.push(res.data);
        comments = comments.concat($scope.data.comments);

        $scope.data.comments = comments;
        $scope.comment.content = "";

      });
    }

    var checkDate = function(date) {
      var now = new Date();
      var temp = new Date(date);
      var dayDif = Math.round((now - temp)  / 1000 / 60 / 60 / 24);
      var text;

      if (dayDif == 0) {
        text = 'Today';
      } else if (dayDif >= 1 && dayDif <= 6) {
        text = dayDif + (dayDif > 1 ? ' days ' : ' day ') + 'ago';
      } else if (dayDif >= 7 && dayDif <= 29) {
        var dayDif = Math.floor(dayDif / 7);
        text = dayDif + (dayDif > 1 ? ' weeks ' : ' week ') + 'ago';
      } else if (dayDif >= 30 && dayDif <= 364) {
        var dayDif = Math.floor(dayDif / 30);
        text = dayDif + (dayDif > 1 ? ' months ' : ' month ') + 'ago';
      } else {
        var dayDif = Math.floor(dayDif / 365);
        text = dayDif + (dayDif > 1 ? ' years ' : ' year ') + 'ago';
      }

      return text;
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