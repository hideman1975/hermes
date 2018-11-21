let app = angular.module('app', ['ngMaterial', 'ngMessages']);

app.controller('AppCtrl', function($scope, $http) {
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
    $scope.create = function(name, age){
        let detail = {
            "name": name,
            "price": age
        };
        $http.post('/products', JSON.stringify(detail)).then(function (response) {
            if (response.data) console.log('response.data', response.data);
            detail._id = response.data.createdProduct._id;
            $scope.artists.push(detail);
        }, function (response) {
            console.log('response.status', response.status);
            console.log('response', response.data.error.message);
         })
            .catch(err => {
                console.log('some thing wrong', err);
            });
    };
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
        let detail = {
            "name": item.name,
            "price": item.price
        };
        console.log('item', item);
        item.editMode = false;
        $http.patch('/products/'+ item._id, JSON.stringify(detail)).then(function (response) {
            if (response.data) console.log('response.data', response.data);
            }, function (response) {
            console.log('response.status', response.status);
            console.log('response.headers()', response.headers());
        });
    };

//---------------ORDERS---------------------------------------------
//-------------------------------------------------------------------------
    $http.get('/orders')
        .success(function (result) {
            $scope.orders = result;
            console.log('success', result);
            $scope.orders.forEach((elem, i, arr) => {
                elem.productName = $scope.productById(elem.product);
            });
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
    }

    //------------------------------------------------------------------------
    $scope.createOrder = function(product, name, quantity) {
        let detail = {
           "product": product,
            "name": name,
            "quantity": quantity
        };
        $http.post('/orders', JSON.stringify(detail)).then(function (response) {
            // console.log('some thing wrong', response);
            if (response.data) console.log('response.data', response.data);
            detail._id = response.data.createdProduct._id;
            detail.productName = $scope.productById(product);
            $scope.orders.push(detail);
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
});




