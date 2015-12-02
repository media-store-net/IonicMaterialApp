var app = angular.module('webapp.controllers', []);

app.controller('openListenDB', function ($scope, listenDB) {
    $scope.myDB = listenDB.openDB();
});

app.controller('listenCtrl', function ($scope, listenDB) {

    listenDB.openDB().then(listen = listenDB.getLists())

    listen.then(
        $scope.listen = listenDB.getLists()
    );

    //

    $scope.addListItems = function(){
        listenDB.addList('Liste 3');
    }
});