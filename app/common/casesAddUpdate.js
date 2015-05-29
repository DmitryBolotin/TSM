(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('casesAddUpdate',['$resource',casesAddUpdate]);


    function casesAddUpdate ($resource) {
        return {

         fetch: function () {
             return $resource('/data/cases/:caseId:caseWeek:caseYear', {caseId:"@caseId", caseWeek:"@caseWeek", caseYear:"@caseYear"}).query(function (thenData) {
                 return thenData;
             });
        }
        };
    }

}());


