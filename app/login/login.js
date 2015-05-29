(function(){
    'use strict';

    angular.module('myApp.login', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl as vm'
            });
        }])

        .controller('LoginCtrl', ['$scope','$rootScope',function () {
            var vm = this;
        }]);


}());
