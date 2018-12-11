
const app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/',
        {
            redirectTo: '/home'
        });
    $routeProvider.when('/home',
        {
            template:'<persons-activity></persons-activity>'
        });
    $routeProvider.when('/person',
        {
            template:'<persons-manager></persons-manager>'
        });
    $routeProvider.when('/office',
        {
            template:'<offices></offices>'
        });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.config(function($mdAriaProvider) {
    // Globally disables all ARIA warnings.
    $mdAriaProvider.disableWarnings();
});