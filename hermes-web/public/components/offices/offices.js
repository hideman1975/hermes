console.log('Offices');
app.component('offices',{
    templateUrl: 'components/offices/offices.html',
    controller: function($scope, $http) {

        //-------------------------------------------------------------------------
        $http.get('/offices')
            .success(function (result) {
                $scope.offices = result;
                console.log('offices now this', result);
                $scope.graphics();
            })
            .error(function (result) {
                console.log('error');
            });
        //------------------------------------------------------------------------

        // $scope.name = '';
        // $scope.age = '';
        // $scope.productImage = null;
        // $scope.city = {};
        $scope.delete = function (item) {
            $http.delete('/offices/' + item._id).then(function (response) {
                if (response.data) console.log('response.data', response.data);
                $scope.offices.splice($scope.offices.indexOf(item), 1);
            }, function (response) {
                console.log('response.status', response.status);
                console.log('response.headers()', response.headers());
            });
        };
        //---------------------------------------------------------------------------
        $scope.edit = function (item) {

            console.log('item', item);
            item.editMode = true;

        };
        //---------------------------------------------------------------------------
        $scope.save = function (item) {
            console.log('saved item', item);
            $scope.patch('/offices/' + item._id, item);
            item.editMode = false;

        };
        //------------------------------------------------------------------------
        $scope.productById = function (item) {
            let name = '';
            $scope.offices.forEach((elem, i, arr) => {
                if (elem._id === item) name = elem.name
            });
            return name
        }

        //---------------File Upload ---------------------------------

        $scope.create = function () {
            let uploadUrl = '/offices';
            $scope.post(uploadUrl, $scope.customer);
            console.log('uploader create', $scope.customer);

        };

        $scope.post = function (uploadUrl, data) {
            let fd = new FormData();
            for (let key in data) {
                fd.append(key, data[key]);
            }

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {
                    if (response.data) {
                        console.log('response.data', response.data);
                        data._id = response.data.createdOffice._id;
                        data.photo = response.data.createdOffice.photo;
                        data.city = response.data.createdOffice.city;
                        $scope.offices.push(data);
                        // console.log('$scope.artists', $scope.artists);
                    }
                }, function (response) {
                    console.log('response.status', response.status);
                })
                .catch(err => {
                    console.log('some thing wrong', err);
                });
        };


        $scope.patch = function (uploadUrl, data) {

            if (typeof data.photo !== 'string') {
                let fd = new FormData();
                for (let key in data) {
                    if(key !== 'financial') fd.append(key, data[key])
                }
                // fd.append('financial', 4);
                // fd.append('financial', 4);
                // fd.append('financial', 4);
                // console.log('financial-------', data.financial);

                $http.patch(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined

                    }
                })
                    .then(function (response) {
                        if (response.data) {
                            data.photo = response.data.editedPerson.photo;
                        }
                    }, function (response) {
                        console.log('response.status', response.status);
                    })
                    .catch(err => {
                        console.log('some thing wrong', err);
                    });
            } else {
                $http.patch(uploadUrl, JSON.stringify(data))
                    .then(function (response) {
                        if (response.data) console.log('response.data', response.data);
                    }, function (response) {
                        console.log('some thing wrong', response);
                    });
            }
        };
        //------------------Graph-----------------------------------
        $scope.graphics = function () {
            $scope.data = [];
            $scope.labels = [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"];
            $scope.series = ['Sales', 'Profit Margin %'];

            if ($scope.offices) {
                $scope.data.push($scope.offices[$scope.activatedOffice].financial);
                $scope.data.push($scope.offices[$scope.activatedOffice].profit);
            }

            $scope.onClick = function (points, evt) {

            };
            $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [{

                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left',

                        },
                        {
                            ticks: {
                                beginAtZero:true,
                                fontFamily: "'Open Sans Bold', sans-serif",
                                fontSize:11,
                                // min: 0,
                                // max: 100,
                                callback: function(value){return value+ "%"}
                            },

                            scaleLabel: {
                                display: true,
                                labelString: 'Profit Margin Percentage',
                            },
                            id: 'y-axis-2',
                            type: 'linear',
                            display: true,
                            position: 'right',

                        }
                    ]
                }
            };
        };
//------------------------------------------------------
$scope.activatedOffice = 0;
     $scope.activate = (item, index) => {
         $scope.activatedOffice = index;
         $scope.graphics();
     }
   }
});

app.directive('fileModel', ['$parse', function ($parse) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            let model = $parse(attrs.fileModel);
            let modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                    console.log('I am changing', scope);
                })
            })
        }
    }
}]);