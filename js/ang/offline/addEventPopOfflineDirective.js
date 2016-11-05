'use strict';
module.exports = function( $compile, PopService, $rootScope){
    return{
        restrict: 'AE',
        scope:{
            eventendtime22: "=",
            eventstarttime22: "=",
            eventlocation: "=",
            eventtitle: "=",
            eventstatus: "=",
            mydate: "@",
            eventdate: "@"

        },
        template: '../templates/popover.html',

        link: function (scope, el, attrs) {

            console.log("directive linking event...");
            $('.close').click(function(){
                console.log("clicked event modal X");
            }) ;
            scope.closePop = function(){
                scope.eventlocation = "";
                scope.eventtitle = "";
                scope.eventtitle = "";
                scope.eventstarttime = "";
                scope.eventendtime = "";
                scope.eventstatus = "";
                $(".webui-popover").hide();

            }
            scope.sendEvent = function(){

                //$scope.eventendtime = scope.eventendtime;
               // $scope.eventstarttime = scope.eventstarttime;
               // $scope.eventlocation = scope.eventlocation;
               // $scope.eventtitle = scope.eventtitle;
                var newEventObj = {};
                var startDateTime  = scope.eventdate + "T" + scope.eventstarttime +":00.000-01:00";
                var endDateTime  = scope.eventdate + "T" + scope.eventendtime +":00.000-01:00";
                //newEventObj.start = {};
                //newEventObj.end = {};
                newEventObj.location = scope.eventlocation;
                newEventObj.title = scope.eventtitle;
                newEventObj.summary = scope.eventtitle;
                newEventObj.start = startDateTime;
                newEventObj.end = endDateTime;
             if(scope.eventendtime == "" || scope.eventstarttime == ""){
                 scope.eventstatus = "Error saving event";
             }
                else{
                 PopService.eventService(newEventObj);
                 console.log("directive send event..." );
             }

            }
            // watch the directive scope variable before compiling the template contents, very critical condition
            scope.$watch(scope.eventendtime, function(){
                // scope.label = scope.label;
                console.log("directive watch...");
                $compile(el.contents())(scope);
             });
            $rootScope.$on("eventSaved", function(){
                 console.log("event save broadcast");
                scope.eventstatus = "Your event was saved";
              //  $compile(el.contents())(scope);
            });
            $rootScope.$on("eventFail", function(){
                console.log("event fail broadcast");
                scope.eventstatus = "Error saving event";
                $compile(el.contents())(scope);
            })

        }

    }
};
