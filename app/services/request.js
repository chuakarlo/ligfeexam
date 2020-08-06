app.service('request', function($http,$q) {
    this.query = function (data, method) {
        var deferred = $q.defer();
        return $http({
            method : method,
            url: data.url,
            data : data
        }).success(function(response){
            deferred.resolve(response);
        }).error(function(data, status, headers){
            var error = data;
            deferred.reject(error);
        });
    }
});