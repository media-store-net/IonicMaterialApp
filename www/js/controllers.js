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
        loadLists();
        //

        $scope.addListItems = function (name) {
            $ionicLoading.show({template: 'speichern'});
            listenDB.addList(name).then(function () {
                $scope.listen = listenDB.getLists();
                $ionicLoading.hide();
                loadLists();
            });
        }

        return $scope;
    });
});