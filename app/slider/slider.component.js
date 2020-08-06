'use strict';

  app.component('slider', {
  templateUrl: "slider/slider.template.html",
  controller: function($scope, request) {
  	$scope.data = [];
  	
    var query = {
		url: 'getPosts?s=0&e=3'
	}

	request.query(query, 'GET').then(function(res) {
		$scope.data = $scope.data.concat(res.data);
	});
  }
});