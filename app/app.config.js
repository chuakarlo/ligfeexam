'use strict';

app.config(['$routeProvider',
  function config($routeProvider) {
    $routeProvider

      .when('/', {
        template: '<slider></slider><news></news>'
      })

      .when('/post/add', {
        template: '<post-add></post-add>'
      })
      
      .when('/post/:postId', {
        template: '<post-show></post-show>'
      })

      .when('/post/:postId/edit', {
        template: '<post-edit></post-edit>'
      })

      .otherwise('/');
    }
  ]);
