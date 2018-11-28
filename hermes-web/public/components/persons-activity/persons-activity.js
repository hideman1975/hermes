
app.component('personsActivity',{
    templateUrl: 'components/persons-activity/persons-activity.html',
    controller: function($scope, $http) {
 //-------------------------------------------------------------------------
        $http.get('/orders/status/st')
            .success(function (result) {
                $scope.persons = result;
            })
            .error(function (result) {
                console.log('error');
            });
        $scope.counter = {};
        $scope.timer = function () {

            let timerId = setInterval(function () {
                $http.get('/orders/status/st').then(function (response) {
                    if (response.data) {
                        $scope.persons = response.data;
                        console.log('$scope.persons',response.data)
                        $scope.counter = response.data;
                    }
                }, function (response) {
                    console.log('Всё херого', response);
                });
            }, 1000);
        };
        // Таймер Опроса БакЭнда
        $scope.timer();
        }
});