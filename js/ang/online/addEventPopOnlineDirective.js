'use strict';

module.exports = function ($compile, PopServiceOnline, $rootScope) {
    return{
        restrict: 'AE',
        template: '../templates/popver.html',


        scope:{
            eventendtime: "=",
            eventstarttime: "=",
            eventlocation: "=",
            eventtitle: "=",
            eventstatus: "=",
            mydate: "@",
            eventdate: "@"

        },
        link: function (scope, el, attrs) {
            scope.popEventObj = {};
            console.log("online directive linking event...");
            scope.closePop = function () {
                $(".webui-popover").hide();
            }
            scope.sendEvent = function () {
                scope.popEventObj.title = scope.eventtitle;
                scope.popEventObj.start = scope.eventstarttime;
                scope.popEventObj.end = scope.eventendtime;
                scope.popEventObj.location = scope.eventlocation;
                PopServiceOnline.eventService(scope.popEventObj);
                console.log("online directive send event...");
            }
            // watch the directive scope variable before compiling the template contents, very critical condition
            scope.$watch(scope.eventendtime, function () {
                // scope.label = scope.label;
                console.log("directive watch...");
                $compile(el.contents())(scope);
            });
            // broadcast event added online status
            $rootScope.$on("eventSavedOnline", function(){
                console.log("online event save broadcast");
                scope.eventstatus = "Your event was saved";
                $compile(el.contents())(scope);
            });
            $rootScope.$on("eventFailOnline", function(){
                console.log("online event fail broadcast");
                scope.eventstatus = "Error saving event";
                $compile(el.contents())(scope);
            })
        }

    }
};
