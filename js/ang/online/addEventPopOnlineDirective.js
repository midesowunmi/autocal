'use strict';

module.exports = function ($compile, PopServiceOnline, $rootScope) {
    return{
        restrict: 'AE',
        template: '<div data-toggle="popover" class="event-popover col-sm-12">' +
            '<div class="col-sm-12"><span class="col-sm-3">Date: </span><span class="col-sm-9">{{mydate}}</span></div>' +
            '<div class="col-sm-12"><span class="col-sm-3">Time: </span><span class="col-sm-9"><input type="text" ng-model="eventstarttime"  class="texteventtime" id="eventstarttime"> &mdash; ' +
            '<input type="text" id="eventendtime2" data-ng-model="eventendtime" class="texteventtime"></span></div>' +
            '<div class="col-sm-12"><span class="col-sm-3">What:</span><span class="col-sm-9"> <input type="text" id="eventtitle" value="" data-ng-model="eventtitle" class="texteventtitle"> </span></div>' +
            '<div class="col-sm-12"><span class="col-sm-3">Where:</span> <span class="col-sm-9"><input type="text" data-ng-model="eventlocation" value="" id="eventlocation" class="texteventtitle"> </span></div>' +
            '<div class="col-sm-12"><span class="col-sm-offset-3 text-info" ng-bind="eventstatus"></span></div>'+
            '<div class="col-sm-12"><span class="col-sm-offset-6"><span class="btn btn-danger" ng-click="closePop()">cancel</span><span class="btn btn-default" ng-click="sendEvent()" id="btnSavePop">save</span></span></div></div>',


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
