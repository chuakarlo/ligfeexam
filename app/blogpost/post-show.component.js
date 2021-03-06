'use strict';

  app.component('postShow', {
  templateUrl: "blogpost/post.template.html",
  controller: function($scope, $routeParams, request, $interval) {
    $scope.comment = {
      content: ""
    };
    var query = {
      url: 'getPost?postId='+$routeParams.postId
    }
    request.query(query, 'GET').then(function(res) {
      $scope.data = res.data;

      $scope.data.comments.forEach(function(item) {
        item.date = checkDate(item.date);
      });
    });

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

    $interval(function() {
      request.query(query, 'GET').then(function(res) {
        $scope.data = res.data;

        $scope.data.comments.forEach(function(item) {
          item.date = checkDate(item.date);
        });
      });
    }, 1000);
  }
});