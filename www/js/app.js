(function () {
    var app = angular.module('webapp', [
    'ionic',
    'webapp.controllers',
    'webapp.services'
    ]);

    // Filter für Anzahl des Materials
    app.filter('matQuantity', function () {
        return function (input) {
            if(!input)
              return 0;

            var output = input.length;
            return output;
        }
    });

    //APP Konfiguration
    app.config(function ($stateProvider, $urlRouterProvider) {
        // Templates //
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/templates/home.html'
        });

        $stateProvider.state('listen', {
            cache: false,
            url: '/listen',
            templateUrl: 'templates/listen.html',
            controller: 'listenCtrl',
            resolve: {
              'listenDB': function ($q, IndexedDB) {
                console.log('init listen db, open the instance')
                return IndexedDB.openInstance('listen');
              },
              'initListen': function ($q, listenDB) {
                console.log('read the initial list elements from the listenDB, note, that listenDB was initialized in previous step');
                return listenDB.getLists();
              },
            }
        });

        $stateProvider.state('singleList', {
            url: '/list/:id',
            controller: 'singleCtrl',
            templateUrl: 'templates/single-list.html',
            resolve: {
              'listenDB': function ($q, IndexedDB) {
                console.log('init or open listen db');
                return IndexedDB.openInstance('listen');
              },
              'selectedList': function ($q, listenDB, $stateParams) {
                console.log('init or open listen db', $stateParams);
                var intId = parseInt($stateParams.id, 10);
                return listenDB.getSingleList(intId);
              },
            }
        });

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html'
        });

        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html'
        });

        $urlRouterProvider.otherwise('/home');

    });

    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
}());
