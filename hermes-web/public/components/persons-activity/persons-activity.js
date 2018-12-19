
app.component('personsActivity',{
    templateUrl: 'components/persons-activity/persons-activity.html',
    controller: function($scope, $http, $interval) {
 //-------------------------------------------------------------------------
        const getActivity = function () {
            $http.get('/orders/status/st')
                .success(function (result) {
                    $scope.persons = result;
                    $scope.persons.forEach((item, i, products) =>{
                        item.timer = fmtMSS(item.timer);
                    });
                    console.log('$scope.persons', result);
                })
                .error(function (result) {
                    console.log('error', result);
                });
        };

        //-------------------------------------------------------------------------
        const getOffices = function () {
            $http.get('/offices')
                .success(function (result) {
                    $scope.offices = result;
                    console.log('offices now this', result);
                })
                .error(function (result) {
                    console.log('error');
                });
        };
        //------------------------------------------------------------------------

        this.$onInit = function () {
            console.log('onInit');
            // $scope.currentNavItem = 'home';
            getActivity();
            getOffices();
            stop = $interval(getActivity, 1000);
        };

        this.$onChanges = function () {
            console.log('onChanges');
        };

        this.$onDestroy = function () {
            $interval.cancel(stop);
            stop = undefined;
        }
     }
});

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
