(function () {
    var app = angular.module('webapp', [
    'ionic','ionic.service.core',
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
            url: '/',
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
            cache: false,
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

        $stateProvider.state('info', {
            url: '/info',
            templateUrl: 'templates/info.html'
        });

        $stateProvider.state('settings', {
            cache: false,
            url: '/settings',
            controller: 'settingsCtrl',
            templateUrl: 'templates/settings.html',
            resolve: {
                'settingsDB': function ($q, IndexedDB) {
                    console.log('init settings db, open the instance')
                    return IndexedDB.openInstance('settings');
                },
                'initSettings': function ($q, settingsDB) {
                    console.log('read the initial list elements from the settingsDB, note, that settingsDB was initialized in previous step');
                    return settingsDB;
                },
            }
        });

        $urlRouterProvider.otherwise('/');

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
