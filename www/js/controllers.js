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
  }
});


app.controller('singleCtrl', function ($q, $scope, $ionicLoading, listenDB, selectedList) {
  console.log('selectedList elements on controller creation', selectedList);
  $scope.list = selectedList;
});
