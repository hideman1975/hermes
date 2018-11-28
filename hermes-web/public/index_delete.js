console.log('index.js')
const app = angular.module('app', ['ngMaterial', 'ngMessages']);
exports = app;



app.controller('AppCtrl', ['$scope', '$http', '$document', function($scope, $http, $document) {
    $scope.editMode = false;

//-------------------------------------------------------------------------
    $http.get('/products')
        .success(function (result) {
            $scope.artists = result;
            console.log('success', result);
        })
        .error(function (result) {
            console.log('error');
        });
//------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    $http.get('/persons')
        .success(function (result) {
            $scope.persons = result;

        })
        .error(function (result) {
            console.log('error');
        });
//------------------------------------------------------------------------
    $scope.name = '';
    $scope.age = '';
    $scope.productImage = null;

    // $scope.create = function(){
    //     let detail = {
    //         "name":  $scope.name,
    //         "price":  $scope.age,
    //         "productImage":  $scope.customer.file
    //     };
    //     console.log('create', detail);
    //     $http.post('/products', JSON.stringify(detail))
    //         .then(function (response) {
    //         if (response.data) console.log('response.data', response.data);
    //         detail._id = response.data.createdProduct._id;
    //         $scope.artists.push(detail);
    //     }, function (response) {
    //         console.log('response.status', response.status);
    //       })
    //         .catch(err => {
    //             console.log('some thing wrong', err);
    //         });
    // };
//------------------------------------------------------------------------
    $scope.delete = function(item){
        $http.delete('/products/'+ item._id).then(function (response) {
            if (response.data) console.log('response.data', response.data);
            $scope.artists.splice($scope.artists.indexOf(item), 1);
        }, function (response) {
            console.log('response.status', response.status);
            console.log('response.headers()', response.headers());
        });
    };
//---------------------------------------------------------------------------
    $scope.edit = function(item){

        console.log('item', item);
        item.editMode = true;

    };
//---------------------------------------------------------------------------
    $scope.save = function(item){
        console.log('svae item', item);
        $scope.patch('/products/'+ item._id, item);
        item.editMode = false;
        // let detail = {
        //     "name": item.name,
        //     "price": item.price,
        //     "productImage": item.productImage
        // };
        // console.log('item', item);
        // item.editMode = false;
        // $http.patch('/products/'+ item._id, JSON.stringify(detail)).then(function (response) {
        //     if (response.data) console.log('response.data', response.data);
        //     }, function (response) {
        //     console.log('response.status', response.status);
        //     console.log('response.headers()', response.headers());
        // });
    };

//---------------ORDERS---------------------------------------------
//-------------------------------------------------------------------------
    $http.get('/orders')
        .success(function (result) {
            $scope.orders = result.orders;
            console.log('success', result);
         })
        .error(function (result) {
            console.log('error');
        });


//------------------------------------------------------------------------
    $scope.saveOrder = function(item){
        let detail = {
            "product": item.product,
            "name": item.name,
            "quantity": item.quantity
        };
        console.log('item', item);
        item.editMode = false;
        $http.patch('/orders/'+ item._id, JSON.stringify(detail)).then(function (response) {
            if (response.data) console.log('response.data', response.data);
        }, function (response) {
            console.log('response.status', response.status);
            console.log('response.headers()', response.headers());
        });
    };

    //------------------------------------------------------------------------
    $scope.createOrder = function(product, name, quantity) {
        let detail = {
           "product": {
               "_id": product,
                "name": $scope.productById(product)
           },
            "name": name,
            "quantity": quantity

        };
        $http.post('/orders', JSON.stringify(detail)).then(function (response) {
            // console.log('some thing wrong', response);
            if (response.data) console.log('response.data', response.data);
            detail._id = response.data.createdProduct._id;
            console.log('response.data', response.data);
            $scope.orders.push(detail);
            console.log('$scope.orders', $scope.orders);
        }, function (response) {
            console.log('response.status', response.status);
            console.log('response', response.data.error.message);
        })
            .catch(err => {
                console.log('some thing wrong', err);
            });
    };
//------------------------------------------------------------------------
    //------------------------------------------------------------------------
    $scope.deleteOrder = function(item){
        $http.delete('/orders/'+ item._id).then(function (response) {
            if (response.data) console.log('response.data', response.data);
            $scope.orders.splice($scope.orders.indexOf(item), 1);
        }, function (response) {
            console.log('response.status', response.status);
            console.log('response.headers()', response.headers());
        });
    };
//---------------------------------------------------------------------------

    $scope.productById = function(item){
        let name = '';
        $scope.artists.forEach((elem, i, arr) => {
            if (elem._id === item) name = elem.name
        });
        return name
    }
$scope.counter = {};
//     $scope.timer = function(){
// // начать повторы с интервалом 2 сек
//         let timerId = setInterval(function() {
//             $http.get('/orders/status/st').then(function (response) {
//                 if (response.data) {
//                     console.log('response.data', response.data);
//                 $scope.counter = response.data;
//                 }
//             }, function (response) {
//                 console.log('Всё херого', response);
//             });
//         }, 1000);

// через 5 сек остановить повторы
//         setTimeout(function() {
//             clearInterval(timerId);
//             alert( 'стоп' );
//         }, 5000);
   // };
        // Таймер Опроса БакЭнда
     // $scope.timer();

    //---------------File Upload ---------------------------------

    $scope.create = function(){
        let uploadUrl = '/products';
        $scope.post(uploadUrl,  $scope.customer);
        console.log('uploader create',  $scope.customer);

    };

    $scope.post = function (uploadUrl, data) {
        let fd = new FormData();
        for(let key in data) fd.append(key, data[key]);
        console.log('fd', fd);
        console.log('data', data);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined

            }
        })
                .then(function (response) {
                if (response.data){
                console.log('response.data', response.data);
                data._id = response.data.createdProduct._id;
                data.productImage = response.data.createdProduct.productImage;
                $scope.artists.push(data);
                console.log('$scope.artists', $scope.artists);
                }
            }, function (response) {
                console.log('response.status', response.status);
              })
                .catch(err => {
                    console.log('some thing wrong', err);
                });
    }


    $scope.patch = function (uploadUrl, data) {
        let fd = new FormData();
        for(let key in data) fd.append(key, data[key]);
        console.log('fd', fd);
        // console.log('typeof data.productImage', typeof data.productImage);
        if (typeof data.productImage !== 'string'){
        $http.patch(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined

            }
        })
            .then(function (response) {
                if (response.data){
                    console.log('response.data', response.data);
                    data.productImage = response.data.editedProduct.productImage;
                    data.name = response.data.editedProduct.name;
                    data.age= response.data.editedProduct.price;
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

}]);


app.controller('uploader', ['$scope', '$http', function($scope, $http){


}]);

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

// module.exports = app;
