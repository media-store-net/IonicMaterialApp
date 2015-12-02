(function () {
    var app = angular.module('webapp', [
    'ionic',
    'webapp.controllers',
    'webapp.services'
    ]);

    // Filter für Anzahl des Materials
    app.filter('matQuantity', function () {
        return function (input) {
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
            templateUrl: 'templates/listen.html'
        });

        $stateProvider.state('singleList', {
            url: '/list',
            templateUrl: 'templates/single-list.html'
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
