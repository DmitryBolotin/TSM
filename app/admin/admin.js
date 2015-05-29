(function(){
  'use strict';

  angular.module('myApp.admin', ['ngRoute'])

      .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/admin', {
          templateUrl: 'admin/admin.html',
          controller: 'AdminCtrl as vm'
        });
      }])

      .controller('AdminCtrl', [function() {

      }]);
}());


