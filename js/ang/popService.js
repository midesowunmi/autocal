//broadcast service linking offlineController with addEventPop directive
offlineController.factory('PopService', function($rootScope){
    return{
        popData: "",
        eventService:function(mdata){
             this.popData = mdata;
            $rootScope.$broadcast("eventAdded");
            console.log("broadcast..." + mdata);
        },
        eventStatus:function(status){
            if(status == 'success'){
                $rootScope.$broadcast("eventSaved");
                console.log("broadcast... event saved " + status);
            }
            if(status == 'fail'){
                $rootScope.$broadcast("eventFail");
                console.log("broadcast... event saved " + status);
            }

        }
    });
