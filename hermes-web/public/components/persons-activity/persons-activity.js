
app.component('personsActivity',{
    templateUrl: 'components/persons-activity/persons-activity.html',
    controller: function($scope, $http, $interval) {
 //-------------------------------------------------------------------------

        const getActivity = function () {
            $http.get('/orders/status/st')
                .success(function (result) {
                    $scope.interaction = 0;
                    $scope.persons = result;
                    $scope.persons.forEach((item, i, products) =>{

                        item.timer = fmtMSS(item.timer);
                        if (item.interaction) $scope.interaction++;
                    });
                    $scope.filteredPersons = $scope.persons;
                    $scope.onSearchInputChanged();
                    // console.log('$scope.persons', result);
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
                    //console.log('offices now this', result);
                })
                .error(function (result) {
                    console.log('error');
                });
        };
        //------------------------------------------------------------------------

        this.$onInit = function () {
            $scope.filter = {
                office: undefined
            };
            //console.log('onInit');
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
        };

   //--------Filter-Sorter---------------------------
        $scope.onSearchInputChanged = () => {
            //console.log('onSearchInputChanged');
            if($scope.filter.office) {
                $scope.filteredPersons = $scope.persons.filter(function (item) {
                    return item.office.city === $scope.filter.office.city;
                });
                //$scope.filtered = true;
            } else {
                $scope.filteredPersons = $scope.persons;
            }
        };
   //------------------------------------------------
        $scope.propertyName = '';
        $scope.reverse = true;

        $scope.sortBy = function(propertyName) {
            console.log('orderBy', propertyName);
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
         };
    }
});

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
