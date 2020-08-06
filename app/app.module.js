'use strict';

var app = angular.module('LIGFrontEndExam', [
	'ngRoute'
]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
}]);

app.service('fileUpload', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl){
           var fd = new FormData();
           fd.append('file', file);

           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           })

           .success(function(){
           })

           .error(function(){
           });
        }
     });

app.directive('footer', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "directives/footer.html",
        controller: function ($scope, $window) {
            $window.onscroll = function() {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    $scope.showButton = true;
                } else {
                    $scope.showButton = false;
                }
                $scope.$apply();
            }

            $scope.backToTop = function() {
                $("html, body").animate({ scrollTop: 0 }, 1000);
            }
        }
    }
});

app.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {user: '='},
        templateUrl: "directives/header.html",
        controller: function ($scope, $rootScope, $http, request) {
            $http.get('users.json')
                .then(function(data) {
                    $rootScope.isAuthenticated = data.data[0].isAuthenticated;
                    $rootScope.users = data.data.slice(1);
                }, function(data) {
                    alert("AJAX failed to load data.");
                });

            $scope.label = "LOGIN";
            $scope.loginSlide = false;
            $scope.registerSlide = false;

            $scope.slideLogin = function() {
                $scope.loginSlide = !$scope.loginSlide;

                if ($scope.loginSlide) {
                    $scope.label = "CLOSE";
                } else {
                    $scope.registerSlide = false;
                    $scope.label = "LOGIN";
                }
            }

            $scope.slideRegister = function() {
                $scope.registerSlide = !$scope.registerSlide;
            }

            $scope.login = function() {
                var stat = false;

                $rootScope.users.forEach(function(item) {
                    if ((item.email == $scope.login.email) && (item.password == $scope.login.password)) {
                        stat = true;
                    }
                });

                $scope.login.email = "";
                $scope.login.password = "";

                if (stat) {
                    $scope.slideLogin();
                    $rootScope.isAuthenticated = "true";

                    authenticate(true);
                } else {
                    alert("Incorrect email and/or password.");
                }
            }

            $scope.logout = function() {
                authenticate(false);
                $rootScope.isAuthenticated = "false";
            }

            $scope.register = function() {
                var stat = false;

                if ($scope.register.password != $scope.register.confPassword) {
                    alert("Password and Confirm Password did not match.");
                    return;
                }

                let user = {
                    email: $scope.register.email,
                    password: $scope.register.password
                };

                $rootScope.users.push(user);
                register($scope.register.email, $scope.register.password);

                $scope.slideLogin();
                $rootScope.isAuthenticated = "true";

                authenticate(true);

                $scope.register.email = "";
                $scope.register.password = "";
                $scope.register.confPassword = "";
            }

            var authenticate = function(flag) {
                var query = {
                    url : 'authenticate?flag='+flag,
                }
                request.query(query, 'POST').then(function(res) {
                    //
                })
            }

            var register = function(email, pass) {
                var query = {
                    url : 'register?email='+email+'&password='+pass,
                }
                request.query(query, 'POST').then(function(res) {
                    //
                })
            }
        }
    }
});