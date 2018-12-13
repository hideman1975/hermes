console.log('Persons Manager')
app.component('personsManager',{
    templateUrl: 'components/persons-manager/persons-manager.html',
    styles: 'components/persons-manager/persons-manager.css',
    controller: function($scope, $http, $filter) {
        console.log('personsManager controller', $scope)

        //-------------------------------------------------------------------------
        $http.get('/persons')
            .success(function (result) {
                $scope.artists = result;
                $scope.filteredPersons = $scope.artists;
                console.log('success', result);
            })
            .error(function (result) {
                console.log('error');
            });
        //------------------------------------------------------------------------
        //-------------------------------------------------------------------------
        $http.get('/offices')
            .success(function (result) {
                $scope.offices = result;
                console.log('offices now this', result);
            })
            .error(function (result) {
                console.log('error');
            });
        //------------------------------------------------------------------------

        $scope.name = '';
        $scope.age = '';
        $scope.productImage = null;
        $scope.city = {};
        $scope.delete = function (item) {
            $http.delete('/persons/' + item._id).then(function (response) {
                if (response.data) console.log('response.data', response.data);
                $scope.artists.splice($scope.artists.indexOf(item), 1);
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
            $scope.patch('/persons/' + item._id, item);
            item.editMode = false;

        };
        //------------------------------------------------------------------------
        $scope.productById = function (item) {
            let name = '';
            $scope.artists.forEach((elem, i, arr) => {
                if (elem._id === item) name = elem.name
            });
            return name
        }

        //---------------File Upload ---------------------------------

        $scope.create = function () {
            let uploadUrl = '/persons';
            $scope.post(uploadUrl, $scope.customer);
            console.log('uploader create', $scope.customer);

        };

        $scope.post = function (uploadUrl, data) {
            let fd = new FormData();
            for (let key in data) {
                if(key !== 'office') fd.append(key, data[key]);
            }
            fd.append('office', data.office._id);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {
                    if (response.data) {
                        console.log('response.data', response.data);
                        data._id = response.data.createdPerson._id;
                        data.photo = response.data.createdPerson.photo;
                        $scope.artists.push(data);
                        console.log('$scope.artists', $scope.artists);
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
                    if(key !== 'office') fd.append(key, data[key])
                }
                //especial cases
                fd.append('office', data.office._id);

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
        $scope.reverse = 'desc';

        $scope.orderBy = () => {
            console.log('Order By', $scope.reverse);
            if($scope.reverse === 'desc'){
                console.log('if asc');
                $scope.reverse = 'asc';
            }
            else {
                console.log('if desc');
                $scope.reverse = 'desc';
            }
        };

//$scope.filtered = false;
        $scope.onSearchInputChanged = () => {
            if($scope.filter.office) {
                $scope.filteredPersons = $scope.artists.filter(function (item) {
                    return item.office.city === $scope.filter.office.city;
                });
               //$scope.filtered = true;
            } else {
               $scope.filteredPersons = $scope.artists;
            }
        }

        $scope.propertyName = 'age';
        $scope.reverse = true;
        // $scope.friends = friends;

        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            //$scope.orderBy();
        };
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

// app.directive('tooltip', function(){
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs){
//             $(element).hover(function(){
//                 console.log('Hover')
//                 // on mouseenter
//                 $(element).tooltip('show');
//             }, function(){
//                 // on mouseleave
//                 $(element).tooltip('hide');
//             });
//         }
//     };
// });