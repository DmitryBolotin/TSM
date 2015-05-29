(function(){
  'use strict';

  angular.module('myApp.report', ['ngRoute'])

      .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/report', {
          templateUrl: 'report/report.html',
          controller: 'ReportCtrl as vm'
        });
      }])

      .controller('ReportCtrl', ['$scope','casesAddUpdate',function($scope,casesAddUpdate) {
        //  console.log("ReportCtrl");

          var vm = this;

          vm.casesForReport = casesAddUpdate.fetch();


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

          Date.prototype.sGetDay = function() {
              var result = 0;
              if (this.getDay() == 0) {
                  result = 6
              } else
              {
                  result = (this.getDay() - 1) %7;
              }
              return result;
          };



          if(vm.calendarStartDate == undefined && vm.calendarEndDate == undefined){
              vm.calendarStartDate = new Date();
              vm.calendarEndDate = new Date();
          }


          vm.getReport = function () {
              vm.casesListSepareted = [{}];
              vm.casesListJoined = [{}];
              vm.casesList= [{}];


              vm.defineHoursForEachCases = function () {
                  var startIndex = 0;
                  var endIndex = 0;
                  for(var i=0; i < vm.casesForReport.length ; i++){
                      var result = 0;
                      if(vm.calendarStartDate.getFullWeek().w <= vm.casesForReport[i].caseWeek && vm.casesForReport[i].caseWeek <= vm.calendarEndDate.getFullWeek().w)
                      {
                          var dif_week_min = vm.calendarStartDate.getFullWeek().w - vm.casesForReport[i].caseWeek;
                          var dif_week_max = vm.calendarEndDate.getFullWeek().w - vm.casesForReport[i].caseWeek;

                          if( dif_week_min == 0){
                              startIndex = vm.calendarStartDate.sGetDay(); // dayFormStartCount
                              endIndex =6;

                          }
                          else if(dif_week_max == 0){
                              startIndex = 0;
                              endIndex = vm.calendarEndDate.sGetDay(); //dayFormEndCount
                          }
                          else
                          {
                              startIndex = 0;
                              endIndex = 6;
                          }

                          //<--shoud be HERE!!!
                          if(dif_week_min == dif_week_max){
                               startIndex = vm.calendarStartDate.sGetDay(); // dayFormStartCount
                               endIndex = vm.calendarEndDate.sGetDay(); //dayFormEndCount
                          }
                          //<--shoud be HERE!!!

                          for(var j= startIndex; j <= endIndex; j++){
                              result = result +  parseFloat(vm.casesForReport[i].caseHours[j]) ;
                          }

                          if(vm.casesForReport[i].caseId != null || vm.casesForReport[i].caseId != "")
                          {
                              vm.casesListSepareted.push({caseId:vm.casesForReport[i].caseId, caseSumOfHours:result, caseWeek: vm.casesForReport[i].caseWeek});
                          }
                      }
                  }
                  vm.casesListSepareted.splice(0,1); // delete first empty element

              };
              vm.defineHoursForEachCases();


              vm.defineWholeSumCases = function () {
                  var tempId =0;
                  var hour = 0;
                  vm.casesListSepareted.forEach(function (item,i) {
                      if(i==0){
                          tempId = item.caseId;
                          hour =  item.caseSumOfHours;
                      }
                      if(item.caseId != tempId){
                          vm.casesListJoined.push({caseId:tempId, caseSumOfHours: hour });
                          hour = 0;
                          tempId = item.caseId;
                      }
                      if (item.caseId == tempId&& i!=0){
                          hour = hour + item.caseSumOfHours;

                      }
                      if((vm.casesListSepareted.length - 1) == i){
                          vm.casesListJoined.push({caseId:tempId, caseSumOfHours: hour });
                      }
                  });

                  vm.casesListJoined.splice(0,1); // delete first empty element
              };
              vm.defineWholeSumCases();

              vm.casesTotal = function () {
                  vm.showTotal = true;
                  var total = 0;
                  vm.casesListJoined.forEach(function (item) {
                      total = total + item.caseSumOfHours;
                  });
                  return total;
              };
              vm.casesTotal();

              if(vm.calendarStartDate.getFullWeek().w != vm.calendarEndDate.getFullWeek().w){
                  vm.casesList = vm.casesListJoined.slice();
              }else{
                  vm.casesList = vm.casesListSepareted.slice();
              }


          };

     //     vm.getReport();



          //TODO: get one service







      }]);
}());
