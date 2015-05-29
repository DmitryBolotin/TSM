(function(){
    'use strict';

    angular.module('myApp.main', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'main/main.html',
                controller: 'MainCtrl as vm'
            });
        }])

        .controller('MainCtrl', ['$scope','casesResource','casesAddUpdate','Notifier', function ($scope,casesResource,casesAddUpdate,Notifier) {
            var vm = this;

            vm.isEditMode = true;

            vm.cases =  casesAddUpdate.fetch();


            vm.highlightDate = function (NumberOfDay) {
                var currentDate =  new Date().getDate();
                var currentMonth =  new Date().getMonth();
                var currentYear =  new Date().getYear();

                if(NumberOfDay==currentDate&& vm.calendar.getMonth() == currentMonth && vm.calendar.getYear() == currentYear){
                    return true;
                }
                else
                {
                    return false
                }
            };





            vm.updateQuery = function () {
                casesResource.query(function(data) {
                    vm.cases = data;
                });
            };

            vm.updateViewMode = function () {
                vm.isEditMode = !vm.isEditMode;
                if(vm.isEditMode){
                    vm.updateQuery();
                }
            };

            vm.hideCases = function (cases) {
                Notifier.notifyWarning("CaseId = " + cases.caseId +"  has been hidden");
                cases.caseIsShown = false;
                cases.register();
                vm.updateQuery();
            };

            vm.showCases = function (query) {
               vm.cases.forEach(function(item) {
                       if(item.caseId == query){
                           Notifier.notifySuccess("CaseId = " + item.caseId +" has been shown");
                           item.caseIsShown = true;
                           item.register();
                       }
                    }
                );
                vm.updateQuery();
                vm.getWeekDays(vm.calendar);
            };
            vm.showAllCasesForCurrentWeek = function () {
               vm.cases.forEach(function (item) {
                       if(item.caseWeek == vm.calendar.getFullWeek().w){
                           item.caseIsShown = true;
                           item.register();
                       }
                    }
                );
                vm.updateQuery();
                vm.getWeekDays(vm.calendar);
            };

            vm.isCurrentWeekForCases = function (cases) {
                return (vm.calendar.getFullWeek().y == cases.caseYear&&vm.calendar.getFullWeek().w == cases.caseWeek);
            };





            vm.getSumHours = function () {
                vm.casesSumOfHours = [0,0,0,0,0,0,0];
                //TODO: mask should be added to hours input [0-9][0-9][0-9].[0-9][0-9]
                for(var k=0; k <= 6 ; k++ ){
                    for(var i=0; i < vm.cases.length ; i++ ){
                        if(vm.calendar.getFullWeek().y == vm.cases[i].caseYear&&vm.calendar.getFullWeek().w == vm.cases[i].caseWeek) {
                            vm.casesSumOfHours[k] =   vm.casesSumOfHours[k] + parseFloat(vm.cases[i].caseHours[k]);
                            //  console.log(vm.cases[i].caseId);
                        }
                    }
                  //  console.log("casesValue " + [k] + "= " +  vm.casesSumOfHours[k]);
                }
                return   vm.casesSumOfHours;
            };




            Date.prototype.getFullWeek = function(){
                var jan1, w, d = new Date(this);
                d.setDate(d.getDate()+4-(d.getDay()||7));		// Set to nearest Thursday: current date + 4 - current day number, make Sunday's day number 7
                jan1 = new Date(d.getFullYear(),0,1);		// Get first day of year
                w = Math.ceil((((d-jan1)/86400000)+1)/7);		// Calculate full weeks to nearest Thursday
                return {y: d.getFullYear(), w: w };
            };
            //Returns ISO 8601 week number
            Date.prototype.getWeek = function(){
                return this.getFullWeek().w;
            };

            vm.getWeekDays = function (caseCalendar) {
                vm.currentWeekDays = [];
                vm.choosenDate = new Date(caseCalendar);
                var choosenDateFormated = vm.choosenDate.getDate();
                var hoursSumByDay =  vm.getSumHours();
                var j=0;
                for(var i= choosenDateFormated - 7 ; i <= choosenDateFormated + 7  ; i++)
                {
                    var someDate = new Date(caseCalendar);
                    var scopeDaysList = new Date(someDate.setDate(i));
                    if (scopeDaysList.getWeek() == vm.choosenDate.getWeek()){
                        var internalWeek = [
                            {day:"Mo", isWeekend:false},
                            {day:"Tu", isWeekend:false},
                            {day:"We", isWeekend:false},
                            {day:"Th", isWeekend:false},
                            {day:"Fr", isWeekend:false},
                            {day:"Sa", isWeekend:true},
                            {day:"Su", isWeekend:true}];
                        vm.currentWeekDays.push({NameOfDay: internalWeek[j].day, isWeekend: internalWeek[j].isWeekend, NumberOfDay: scopeDaysList.getDate(), hoursSum: hoursSumByDay[j]});
                        j++;
                    }
                    // console.log(vm.currentWeekDays);
                }
            };

////<<<<<----

            if(vm.calendar == undefined){
                vm.calendar = new Date();
                vm.getWeekDays(vm.calendar);
            }

            vm.addCase = function (cases) {
                vm.getWeekDays(vm.calendar);
                cases.caseWeek = vm.calendar.getFullWeek().w;
                cases.caseYear = vm.calendar.getFullWeek().y;
                cases.register();
                vm.updateQuery();
                Notifier.notifySuccess("CaseId = " + cases.caseId +" has been created");
            };


            vm.updateQuery();



            vm.updateCaseId =  function (cases) {
                vm.getWeekDays(vm.calendar);
                cases.caseWeek = vm.calendar.getFullWeek().w;
                cases.caseYear = vm.calendar.getFullWeek().y;
                cases.register();
              vm.updateQuery();
              vm.updateViewMode();
                Notifier.notifySuccess("CaseId = " + cases.caseId +" has been updated");
            };


        }]);

}()) ;
