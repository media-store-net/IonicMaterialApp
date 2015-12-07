var app = angular.module('webapp.controllers', []);

app.controller('listenCtrl', function ($q, $scope, $ionicLoading, listenDB, initListen) {

    console.log('init listen elements on controller creation', initListen);

    $scope.listen = initListen;

    function loadLists() {
        return listenDB.getLists().then(function (listen) {
            console.log('got listen: ', listen);
            $scope.listen = listen;
        });
    }

    $scope.addListItems = function (name) {
        console.log('chain all the async calls in good order');
        $q.when(true).then(function () {
            console.log('1), show loading indicator');
            $ionicLoading.show({template: 'speichern'});
        }).then(function () {
            console.log('2), add new list');
            return listenDB.addList(name);
        }).then(function () {
            console.log('3), reload the list');
            return loadLists();
        }).then(function () {
            console.log('4), hide loading indicator');
            $ionicLoading.hide();
        });
    };

    // Delete Function

    $scope.remove = function (listID) {
        console.log('remove function run');
        $q.when(true).then(function () {
            console.log('delete list item');
            return listenDB.deleteList(listID);
        }).then(function () {
            console.log('reload the list');
            return loadLists();
        });
    }
});

//Single view controller
app.controller('singleCtrl', function ($q, $state, $scope, $ionicLoading, listenDB, initListen) {
    var listID = $state.params.id;
    $scope.listen = initListen;
    //console.log($scope.listen);
    for (var i = 0; i < $scope.listen.length; i++){
        if($scope.listen[i].id == listID){
            console.log($scope.listen[i]);
            $scope.list = $scope.listen[i];
            return;
        }
    }

    function loadSingleList() {
        return listenDB.getSingleList(listID).then(function (list) {
            console.log('got list item: ', list);
            $scope.list = list;
        });
    }

});



