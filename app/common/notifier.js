(function() {
    'use strict';

    angular.module('common.services').value('toastr', toastr)
        .factory('Notifier', Notifier);


    function Notifier (toastr) {
        return {
            notifySuccess: function(msg) {
                toastr.success(msg);
            },
            notifyWarning: function(msg) {
                toastr.warning(msg);
            }



        }
    }

}());
