console.log('Offices');
app.component('offices',{
    templateUrl: 'components/offices/offices.html',
    controller: function($scope, $http) {

        $scope.defaultColors = [
            '#e1d9dc',
            '#b5abac',
            '#868081',
            '#635f5f',
            '#4d4a4d',
            '#212120',
            '#fbf4ff',
            '#fff5ea',
        ];
        $scope.labels = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"];
 //----------------------Get All Offices---------------------------------------------------
        $http.get('/offices')
            .success(function (result) {
                $scope.offices = result;
                $scope.sumSales();
                $scope.activate(0);
               })
            .error(function (result) {
                console.log('error');
            });
 //----------------------------------------------------------------------------------------
        $scope.delete = function (item) {
            $http.delete('/offices/' + item._id).then(function (response) {
                if (response.data) console.log('response.data', response.data);
                $scope.offices.splice($scope.offices.indexOf(item), 1);
            }, function (response) {
                console.log('response.status', response.status);
                console.log('response.headers()', response.headers());
            });
        };
//------------------------------------------------------------------------------------------
        $scope.edit = function (item) {
            item.editMode = true;
        };
 //-----------------------------------------------------------------------------------------
        $scope.save = function (item) {
            $scope.patch('/offices/' + item._id, item);
            item.editMode = false;
        };
//------------------------------------------------------------------------------------------
        $scope.productById = function (item) {
            let name = '';
            $scope.offices.forEach((elem, i, arr) => {
                if (elem._id === item) name = elem.name
            });
            return name
        };
 //-----------------------------File Upload ------------------------------------------------
        $scope.create = function () {
            let uploadUrl = '/offices';
            $scope.post(uploadUrl, $scope.customer);
        };

        $scope.post = function (uploadUrl, data) {
            let fd = new FormData();
            let emptyArray = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
            let emptyProfit = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
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
                        let newOffice = {};
                        console.log('response.data', response.data);
                        newOffice._id = response.data.createdOffice._id;
                        newOffice.photo = response.data.createdOffice.photo;
                        newOffice.city = response.data.createdOffice.city;
                        newOffice.address = response.data.createdOffice.address;
                        newOffice.financial = emptyArray;
                        newOffice.profit = emptyProfit;
                        $scope.offices.push(newOffice);
                    }
                }, function (response) {
                    console.log('some thing wrong', response);
                });
        };
//------------------Edit Office---------------------------------------------------
        $scope.patch = function (uploadUrl, data) {
            console.log('changed------', data);
            //if (typeof data.photo !== 'string') {
            if(data.image){
                console.log('no string------', data);
                let fd = new FormData();
                for (let key in data) {
                    if(key !== 'financial' && key !== 'profit') fd.append(key, data[key])

                }
                data.financial.forEach((item, i, arr) => {
                    fd.append('financial[]', item);
                });
                data.profit.forEach((item, i, arr) => {
                    fd.append('profit[]', item);
                });
            $http.patch(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined }
                })
                    .then(function (response) {
                        if (response.data) {
                            data.photo = response.data.editedPerson.photo;
                            data.image = null;
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
 //------------------Chart Library-----------------------------------
        $scope.graphics = function () {
            $scope.data = [];

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


        $scope.pieGraphics = function () {
            $scope.pieOptions = {
                maintainAspectRatio: true,
                responsive: true,
                legend: {
                    display: true
                }

            };

            $scope.pieLabels = [
                $scope.offices[0].city,
                $scope.offices[1].city,
                $scope.offices[2].city,
                $scope.offices[3].city,
                $scope.offices[4].city,
                $scope.offices[5].city,
                $scope.offices[6].city
            ];

        };
        $scope.pieData = [];
        $scope.sumSales = function () {

            $scope.offices.forEach((item, index, arr) => {
            let sumSales = 0;
                item.financial.forEach((item, index, arr) => {
                    sumSales = sumSales + Number(item);
                });
                $scope.pieData.push(sumSales);
            })
        };
//------------------------------------------------------
$scope.activatedOffice = 0;
     $scope.activate = (index) => {
         $scope.colors = [];
         $scope.activatedOffice = index;
         $scope.colors =$scope.defaultColors.slice(0);
         $scope.colors[index] = '#26ff29';
         $scope.graphics();
         $scope.pieGraphics();
     }
//------End of Component------------------------------------------
   }

});
//----------Upload Directive---------------------------------------------------
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
//---------------------------------------------------------------------------------