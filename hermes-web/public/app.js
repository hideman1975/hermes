
const app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/home',
        {
            template:'<persons-activity></persons-activity>',
        });
    $routeProvider.when('/person',
        {
            template:'<persons-manager></persons-manager>',
        });
    $routeProvider.when('/office',
        {
            template:'<offices></offices>',
        });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});