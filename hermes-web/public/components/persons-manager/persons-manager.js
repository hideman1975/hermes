console.log('Persons Manager')
app.component('personsManager',{
    templateUrl: 'components/persons-manager/persons-manager.html',
    controller: function($scope, $http) {
        console.log('personsManager controller', $scope)

        //-------------------------------------------------------------------------
        $http.get('/persons')
            .success(function (result) {
                $scope.artists = result;
                console.log('success', result);
            })
            .error(function (result) {
                console.log('error');
            });
        //------------------------------------------------------------------------

        $scope.name = '';
        $scope.age = '';
        $scope.productImage = null;

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
            for (let key in data) fd.append(key, data[key]);
            console.log('fd', fd);
            console.log('data', data);
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
            let fd = new FormData();
            for (let key in data) fd.append(key, data[key]);
            console.log('fd', fd);
            // console.log('typeof data.productImage', typeof data.productImage);
            if (typeof data.photo !== 'string') {
                $http.patch(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined

                    }
                })
                    .then(function (response) {
                        if (response.data) {
                            console.log('response.data', response.data);
                            data.photo = response.data.editedPerson.photo;
                            data.name = response.data.editedPerson.name;
                            data.age = response.data.editedPerson.age;
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

                    });
            }
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