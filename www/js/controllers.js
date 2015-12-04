var app = angular.module('webapp.controllers', []);

app.controller('openListenDB', function ($scope, listenDB) {
    $scope.myDB = listenDB.openDB();
});

app.controller('listenCtrl', function ($scope, $ionicLoading, listenDB) {

    var listen = '';

    listenDB.openDB().then(function () {

        function loadLists() {
            listen = listenDB.getLists();

            listen.then(function () {
                $scope.listen = listen;
            });
        }

        // Add List Function
        $scope.addListItems = function (name) {
            $ionicLoading.show({template: 'speichern...'});
            listenDB.addList(name).then(function () {
                $scope.listen = listenDB.getLists();
                $ionicLoading.hide();
                loadLists();
            });
        }

        // Delete Function
        $scope.remove = function (listID) {
            $ionicLoading.show({template: 'wird gelöscht...'});
            listenDB.deleteList(listID);
            $ionicLoading.hide();
            loadLists();
        }

        loadLists();

        return $scope;
    });
});

app.controller('singleCtrl', function ($scope, $state, $ionicLoading, listenDB) {
    listID = $state.params.id;

    listenDB.openDB().then(function () {
        //TODO
        function loadSingleList(ID) {

        }
        console.log(loadSingleList(listID));
    });
});
