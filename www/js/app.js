(function () {
    var app = angular.module('webapp', ['ionic']);

    //APP Konfiguration
    app.config(function ($stateProvider, $urlRouterProvider) {
        // Templates //
        $stateProvider.state('home', {
            url: '/home',
            templateURL: '/templates/home.html'
        });

        $stateProvider.state('listen', {
            url: '/listen',
            templateURL: 'templates/listen.html'
        });

        $stateProvider.state('singleList', {
            url: '/list',
            templateURL: 'templates/single-list.html'
        });

        $stateProvider.state('login', {
            url: '/login',
            templateURL: 'templates/login.html'
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
