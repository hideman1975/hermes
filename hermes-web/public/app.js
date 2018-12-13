
const app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute', 'chart.js']);

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
    $routeProvider.when('/graph',
        {
            template:'<h2>Graph</h2><div ng-controller="LineCtrl">' +
            '<canvas id="line" class="chart chart-line" chart-data="data"\n' +
            'chart-labels="labels" chart-series="series" chart-options="options"\n' +
            'chart-dataset-override="datasetOverride" chart-click="onClick">\n' +
            '</canvas>' +
            '' +
            '</div>'
        });
});

app.config(function($mdAriaProvider) {
    // Globally disables all ARIA warnings.
    $mdAriaProvider.disableWarnings();
});

app.config(function(ChartJsProvider) {

    ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
});