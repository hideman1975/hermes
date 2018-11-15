console.log('Public folder started', this)
//console.log('Public folder started', scope)

var app = angular.module('app', []);


app.controller('AppCtrl', function($scope, $http) {
// $scope.artists = [{name: 'Andrew'}, {name: 'Sergey'}, {name: 'Nadya'}]
    console.log('items', $scope);

    $http.get('/orders')
        .success(function (result) {
            $scope.artists = result;
            console.log('success', result);
        })
        .error(function (result) {
            console.log('error');
        });

});