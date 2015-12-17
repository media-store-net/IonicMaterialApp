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
app.controller('singleCtrl', function ($q, $scope, $state, $ionicLoading, listenDB, selectedList) {
    console.log('selectedList elements on controller creation', selectedList);
    $scope.list = selectedList;
    $scope.itemCache = {}; // wird nur zum kopieren und pushen verwendet
    $scope.optionsArray = [
        'Dübel',
        'Fixanker',
        'Schrauben',
        'U-Scheiben',
        'Nageldübel',
        'Selbstschneider',
        'Muttern',
        'Blindnieten',
        'Kabelbinder',
        'Klebeschellen',
        'Adernendhülsen',
        'Fett-Spray',
        'Alu-Spray',
        'Zink-Spray',
        'RostOff'
    ];

    $scope.addListMat = function (matForm, formData) {
        if (matForm.$valid) {
            $scope.itemCache = angular.copy(formData);
            if ($scope.itemCache) {
                $scope.list.mat.push($scope.itemCache);
                console.log('item pushed');
                return;
            }
        }
    }

    $scope.remove = function (name) {
        var matArray = $scope.list.mat;

        for (var i = 0; i < matArray.length; i++) {

            if (matArray[i].name === name) {
                matArray.splice(i, 1);
                console.log('item removed');
                return;
            }
        }

    }

    $scope.updateListItem = function (listID) {
        console.log('update function run');
        $q.when(true).then(function () {
            $ionicLoading.show({template: 'speichert...'})
        }).then(function () {
            return listenDB.updateList($scope.list);
        }).then(function () {
            $ionicLoading.hide();
        });
    }

});

//Settings controller
app.controller('settingsCtrl', function ($q, $scope, $state, settingsDB, initSettings, AuthService) {
    // Handling User AuthService
    $scope.user = AuthService;

    // Handling SettingsForm and SettingsDB
    $scope.viewSettingsForm = true;
    var settings = $q.when(initSettings.getSettings());

    settings.then(function () {
        $scope.settings = settings.$$state.value[0];
        if($scope.settings){
            $scope.viewSettingsForm = false;
        }
    });

    $scope.putSettings = function (FormData) {
        initSettings.saveSettings(1,FormData.name, FormData.vorname, FormData.kfz, FormData.email)
            .then(function () {
                $scope.viewSettingsForm = false;
            }).then(function () {
                $state.go('home');
            });
    }


});