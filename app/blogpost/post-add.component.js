'use strict';

  app.component('postAdd', {
  templateUrl: "blogpost/post.template.html",
  controller: function($scope, $rootScope, request, $window, fileUpload) {

    $scope.add = true;

    $scope.data = {
      date: new Date(),
      title: '',
      image: 'img/img1.jpg', // TODO: replace when upload is fixed :(
      content: ''
    }

    $scope.save = function() {
      if ('' == $scope.data.title
        // && '' == $scope.data.image // TODO: return when upload is fixed :(
        && '' == $scope.data.content) {
        $window.location.href = '#/';
        return;
      }

      var query = {
        url: 'savePost?new=true',
        data: {
          'title': $scope.data.title,
          'image': $scope.data.image, // TODO: replace when upload is fixed :(
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
        // || '' != $scope.data.image // TODO: replace when upload is fixed :(
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
        // console.log(files);

        // var file = files[0];

        // console.log('file is ' );
        // console.dir(file);

        // var uploadUrl = "upload";
        // fileUpload.uploadFileToUrl(file, uploadUrl);
    }

  }
});