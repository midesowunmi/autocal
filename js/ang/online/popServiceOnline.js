'use strict';

module.exports = function ($rootScope) {
    return{
        popData: "",
        eventService: function (mdata) {
            this.popData = mdata;
            $rootScope.$broadcast("eventAdded");
            console.log("broadcast..." + mdata);
        },
        eventStatus:function(status){
            if(status == 'success'){
                $rootScope.$broadcast("eventSavedOnline");
                console.log("broadcast... event saved " + status);
            }
            if(status == 'fail'){
                $rootScope.$broadcast("eventFailOnline");
                console.log("broadcast... event saved " + status);
            }

        }
    }

};
