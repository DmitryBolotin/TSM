(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('casesResource',['$resource',casesResource]);


    function casesResource ($resource) {

       var Cases = $resource('/data/cases/:caseId:caseWeek:caseYear', {caseId:"@caseId", caseWeek:"@caseWeek", caseYear:"@caseYear"});

        Cases.prototype.register = function () {
         //  if(userId == this.userId){ console.log("matched userId = " + userId);}
            this.isPrimary = false;
            this.$save();
        };
        return Cases;
    }

}());


