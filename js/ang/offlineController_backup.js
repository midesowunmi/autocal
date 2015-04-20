/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 9/5/14
 * Time: 8:54 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

/*
    offlineController for the chrome-extension component
 */
   //http://jsfiddle.net/ivankovachev/U4GLT/light/  popover directive
// create controller module
var offlineController = angular.module('offlineController',[]);

offlineController.controller('offlineCtrl',[ '$scope','$compile','PopService','$rootScope',
    function($scope, $compile, PopService, $rootScope){
        window.offline = $scope;
        // scope variables
        $scope.oldEventsList = localStorage.getItem('eventsList');
        $scope.eventlocation = "";
        $scope.eventtitle = "";
        $scope.label = PopService.popData;// "controller label";
        $scope.eventendtime = "today";

       console.log("init offlineController");

        var views = chrome.extension.getViews();
        for (var i = 0; i < views.length; i++) {
            var view = views[i];

            console.log("views... " +view.location.href);
        }

        chrome.webRequest.onHeadersReceived.addListener(
            function(info) {
                var headers = info.responseHeaders;
                for (var i=headers.length-1; i>=0; --i) {
                    var header = headers[i].name.toLowerCase();
                    if (header == 'x-frame-options' || header == 'frame-options') {
                        headers.splice(i, 1); // Remove header
                    }
                }
                return {responseHeaders: headers};
            },
            {
                urls: [ 'https://*.google.com/' ], // Pattern to match all http(s) pages
                types: [ 'sub_frame' ]
            },
            ['blocking', 'responseHeaders']
        );
        /*   sample events

        $scope.newEvent2 = {
            "summary": "Bloomberg BusinessWeek Conference",
            "location": "221 Old Bond Street, London, United Kingdom",
            "start": "2014-09-19T10:00:00.000-07:00",
            "end":  "2014-09-19T10:25:00.000-07:00",
            "sequence": 0
        };

        $scope.newEvent = {
            "summary": "Alishia Birthday Bash",
            "location": "Sheraton Hotel, 2400 Chrystal Blvd, Los Angeles, CA 90210",
            "start": {
                "dateTime": "2014-10-09T10:00:00.000-07:00"
            },
            "end": {
                "dateTime": "2014-10-09T10:25:00.000-07:00"
            },
            "sequence": 0
        };
         */

        // initialize the fullCalendar instance

        $("#clientCal").fullCalendar({
            events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"},
            eventSources: [  //'https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic',
                            JSON.parse($scope.oldEventsList)
            ],
            // calendar top nav buttons
            header: {
                    left: 'prev, next, today',
                    center: 'title',
                    right: 'month, basicWeek basicDay'
            },
            // event handler for days, handles the event edit popover button click events
            dayClick : function(date,jsEvent, view){


                console.log("clicked on " + date.format() + jsEvent.target.id);
                //$(".fc-day-content").popover('show');
                $scope.initPop();
                if(jsEvent.target.id == "btnSavePop"){
                    $scope.savepop();
                }

                if(jsEvent.target.id == "btnClosePop"){
                    $scope.closepop();
                }
                $scope.eventendtime = "";
                $scope.mydate = date.format("ddd, MMM D, YYYY");
                $scope.eventdate = date.format();
                $scope.$digest()
                setTimeout( $scope.makePop($scope.mydate), 500);

            },
            eventRender: function (event, element) {
                //element.attr('href', 'javascript:void(0);');

               // element.attr('onclick', 'openModal("' + event.title + '","' + event.description + '","' + event.url + '","' + event.start + '","' + event.end + '");');
            },
            // event handler for calendar event edit modal
            eventClick: function(event, jsEvent, view){
                $scope.editevent = event;
                $scope.editeventdate = event.start.format('YYYY-MM-DD');
                console.log("edit event date is " + $scope.editeventdate);
                $scope.openModal(event.title,event.description,event.start,event.end);
            },
            // access to each calendar day's td element
            dayRender: function(date, cell){
             //   cell.attr('rel','popover');

            }
        });

        // opens edit event modal
        $scope.openModal = function (title, info, start, end) {
            // find opened event index in localStorage
            var eventsList = localStorage.getItem('eventsList');
           // console.log(eventsList);
            eventsList = JSON.parse(eventsList);
            $scope.eventListJson =  eventsList;
            var eventid = moment($scope.editevent.start).format();
            var eventidStr = eventid.toString().slice(0,16);
            for(var i = 0; i < eventsList.length; i++){
                var eventidStr2 =  eventsList[i].start.toString().slice(0,16);
                //console.log (eventsList[i].start);
                if(eventidStr == eventidStr2){
                    console.log("opened... " + eventsList[i].title);
                    $scope.editEventIndex = i;
                    //delete eventsList[i];
                }
            }

            if (start && start != 'null') {
                $scope.txteventstartmodal =   moment(start).format('YYYY-MM-DD HH:mm');
                $("#txtEventStartModal").attr('placeholder',moment(start).format('MMMM Do YYYY, h:mm:ss a') );
                $("#event-content").append("Start: " + moment(start).format('MMMM Do YYYY, h:mm:ss a') + "<br />")
            } else {
                $("#event-content").append(""); //no start (huh?) clear out previous info.
            }
            if (end && end != 'null')
            {
                $scope.txteventendmodal =   moment(end).format('YYYY-MM-DD HH:mm');
                $("#event-content").append("End: " + moment(end).format('MMMM Do YYYY, h:mm:ss a') + "<br /><br />")
            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }
            if (info && info != 'null')
            {
                $("#event-content").append(info + "<br /><br />")
            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }

            $("#event-title").html(title);
            $(".event-modal").modal();
        }
        // clear modal content when it closes
        $('.event.modal').on('hidden.bs.modal', function (e) {
            console.log("close modal");
            $("#event-content").html("");
        })

        // clear modal content when close button clicked
        $(".close-modal").click(function(){
            console.log("close modal");
            $("#event-content").html("");
        });
        $("#btnGoOnline").click(function (){
            $("#offlineCal").hide();
            $("#onlineFrame").show();

        });
        $("#btnAddEvent").click(function (){
            chrome.tabs.create({url: "https://www.naijametro.com/calendar/index_web.html"})
            console.log("open tab...");
        });
        // delete current event from localStorage in event edit modal
        $("#btneventdelete").click(function (){
            var eventsList = localStorage.getItem('eventsList');
            var eventsDelArr = new Array();
            eventsList = JSON.parse(eventsList);
            var eventid = moment($scope.editevent.start).format();
            var eventidStr = eventid.toString().slice(0,16);

              console.log("deleting event..." +eventid + " str  " + eventidStr );
            for(var i = 0; i < eventsList.length; i++){
                var eventidStr2 =  eventsList[i].start.toString().slice(0,16);
                console.log (eventsList[i].title);
                if(eventidStr == eventidStr2){
                    console.log("deleting..." + eventsList[i].title);
                    $scope.eventdelete = eventsList[i];
                    eventsDelArr.push(eventsList[i]);
                    eventsList.splice(i,1);

                }
            }
            // create new eventslist  without the deleted event, remove null value from the list
            var newEventList = JSON.stringify(eventsList);
            var newEventList2 = newEventList.replace(/null,/g,"");
            localStorage.setItem('eventsList', newEventList2);
            // add new event source from newEventList to display in calendar when user clicks save

            $("#clientCal").fullCalendar('removeEvents');
            $("#clientCal").fullCalendar( {
                events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"}
            });
            $("#clientCal").fullCalendar('addEventSource',JSON.parse(newEventList2));
            $("#clientCal").fullCalendar('refetchEvents');
            $("#clientCal").fullCalendar('gotoDate',$scope.editeventdate);
            console.log(newEventList2);

        });

        // cancel event edit in modal
        $("#btneventcancel").click(function (){
          console.log("cancel event edit modal");
            var remindat = moment($scope.editevent.start).subtract('hours', 3).format();
            console.log("remind me at..." +remindat);

        });

        //save event edits in modal
        $("#btneventsave").click(function (){
            var editedEventObj = {};
            if($scope.txteventstartmodal !== "" && !moment($scope.txteventstartmodal).isValid() ){
                console.log("bad date");
            }

            else{
                console.log("valid date");
                editedEventObj.start =  $scope.txteventstartmodal;
                editedEventObj.end =  $scope.txteventendmodal;
               // editedEventObj.title = $scope.txteventtitlemodal;
               // editedEventObj.location =  $scope.txteventlocationmodal;
                console.log("new event start " + editedEventObj.start) ;
               // $scope.evenListJson  [$scope.editEventIndex] = editedEventObj;

            }
           console.log("save event edit modal");
        });

        // init event add popover
        $scope.initPop = function(){
            /*
            var views = chrome.extension.getViews();
            for (var i = 0; i < views.length; i++) {
                var view = views[i];

                console.log("views... " +view.location.href);
            }
            //views[1].location.reload();   */

            // add time picker to event start text field
            $('#eventstarttime').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '08:00', '08:30', '09:00','09:30','10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30','14:00','14:30',
                    '15:00','15:30','16:00','16:30','17:00', '17:30', '18:00'
                ]
            });
            // add time picker to event end field
            $('#eventendtime2').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '08:00', '08:30', '09:00','09:30','10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30','14:00','14:30',
                    '15:00','15:30','16:00','16:30','17:00', '17:30', '18:00'
                ]
            });

            //add time picker to remind hours
            $('#remindhours').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00',  '09:00','10:00', '11:00', '12:00'
                ]
            });

            // init configure the event add popover
           /* $(".fc-event-container td, .fc-view-basicDay, .fc-view-basicWeek td").popover({
                placement: 'auto right',
                delay: { "show": 100, "hide": 100 },
                trigger: 'click',
                html: 'true',
                viewport: { "selector": ".offlinebody", "padding": 50 },
                title : '<span class="text-info"><strong>Add event</strong></span> <button     type="button" id="btnClosePop" class="close">&times;</button></span>',
                content:  function(){

                    //      add event popover html string ***** should be in a directive template *******
                    return $compile('<div data-toggle="popover" class="event-popover">' +
                        'When: '+ $scope.mydate +  '<br />Time: <input type="text" data-ng-model="eventstarttime"  class="texteventtime" id="eventstarttime"> &mdash; '+
                        '<input type="text" id="eventendtime2" data-ng-model="eventendtime" class="texteventtime"><br />' +
                        'What: <input type="text" id="eventtitle" value="" data-ng-model="eventtitle" class="texteventtitle"> <br />'+
                        'Where: <input type="text" data-ng-model="eventlocation" value="" id="eventlocation" class="texteventtitle"> <br />'+
                        'Reminder: <input type="text" data-ng-model="remindhours" value="" id="remindhours" class="texteventtime"> <br />'+
                        '<span class="btn btn-default" id="btnSavePop">save</span></div>') ($scope)


                }
            })  */
        }  // end initPop

        // handle event add popover close button click
         $scope.closepop = function(){

             console.log("close popup...");
             $(".fc-day-content").popover('hide');
            /* $("#clientCal").fullCalendar('refetchEvents');
             $("#clientCal").fullCalendar('rerenderEvents');
             $("#clientCal").fullCalendar('renderEvent',$scope.newEventStr, true);
             $("#clientCal").fullCalendar('gotoDate', $scope.eventdate);   */
             console.log("go to date..." + $scope.eventdate);
         }

        // save new event from popover
         $scope.savepop = function(){

             // create new event object
             var newEventObj = {};
             var startDateTime  = $scope.eventdate + "T" + $scope.eventstarttime +"+0000";
             var endDateTime  = $scope.eventdate + "T" + $scope.eventendtime +"+0000";
             //newEventObj.start = {};
             //newEventObj.end = {};
             newEventObj.location = $scope.eventlocation;
             newEventObj.title = $scope.eventtitle;
             newEventObj.start = startDateTime;
             newEventObj.end = endDateTime;

             console.log("new event obj " + JSON.stringify(newEventObj));

             // retrieve current event list from extension localStorage
             $scope.oldEventsList = localStorage.getItem('eventsList');
             var oeJson = JSON.parse($scope.oldEventsList);
             //$scope.eventList = oldEventsList;
             console.log("event list... " + oeJson.length);
             $scope.newEventStr = JSON.stringify(newEventObj);
             var inc = oeJson.length;
             oeJson[inc] = newEventObj;

             var newEventList =  JSON.stringify(oeJson);
             localStorage.setItem('eventsList', newEventList);
             $scope.newEventsList = localStorage.getItem('eventsList');
             console.log("stored new event list... " + JSON.stringify($scope.newEventsList));

             //events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"}
             // add new event source from newEventList to display in calendar when user clicks save
             $("#clientCal").fullCalendar('removeEvents');
             $("#clientCal").fullCalendar( {
                 events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"}
             });

             $("#clientCal").fullCalendar('addEventSource',JSON.parse($scope.newEventsList));
             $("#clientCal").fullCalendar('refetchEvents');
             $("#clientCal").fullCalendar('renderEvent',$scope.newEventStr, true);
             $("#clientCal").fullCalendar('gotoDate',$scope.eventdate);

         };

        // new event popover save button event handler  **** does this work?****
        $(".btnSavePop").click(function(){
            //alert(event.isDefaultPrevented());
            var oldEventsList = localStorage.getItem('eventsList');

            //$scope.eventList = oldEventsList;
            console.log("event list... " + oldEventsList);
        });
        $scope.change = function(){
            console.log("changing...");
        }
        $scope.$on("eventAdded", function(){
            console.log("broadcast rcvd "+PopService.popData)
        })
        $scope.makePop = function(val) {
            $scope.eventendtime = "today";

        $('.fc-day-content').webuiPopover({

            content:function(){

                return $compile('<div data-toggle="popover" class="event-popover">' +
                    'When: {{mydate}}' +  '<br />Time: <input type="text" ng-model="popLabel"  class="texteventtime" id="eventstarttime"> &mdash; '+
                    '<input type="text" id="eventendtime2" ng-change="change()" data-ng-model="label" class="texteventtime"><br />' +
                    'What: <input type="text" id="eventtitle" value="" data-ng-model="eventtitle" class="texteventtitle"> <br />'+
                    'Where: <input type="text" data-ng-model="eventlocation" value="" id="eventlocation" class="texteventtitle"> <br />'+
                    '<add-event-pop>{{label}}</add-event-pop><span ng-model="popLabel"></span><span class="btn btn-default" ng-click="sendEvent()" id="btnSavePop">save</span></div>') ($scope)
                //$scope.refresh()
                $scope.$digest();
            }



        });
            $("#btnSavePop").click(function(){
                //alert(event.isDefaultPrevented());
                var oldEventsList = localStorage.getItem('eventsList');
                //$scope.$digest();
                //$scope.eventList = oldEventsList;
               // $scope.$apply();
                var scope = angular.element('.fc-day-content').scope();
               // scope.$digest();
                //scope.$apply();
                console.log("event list... " + $scope.eventendtime);
            });
            console.log("makePop");
           // $scope.refresh();
           // $scope.$apply();
           // $scope.$digest();
            var scope = angular.element('.fc-day-content').scope();
          // $scope.$digest();
          //scope.refresh();
          //scope.$apply();
            console.log("event list... " + $scope.eventendtime);


        }

        // handle click on calendar day and show popover
        $(".fc-day-content2").popover({
            placement: 'auto right',
            delay: { "show": 100, "hide": 100 },
            trigger: 'click',
            html: 'true',
            viewport: { "selector": "body", "padding": 50 },
            title : '<span class="text-info"><strong>Add event</strong></span> <button     type="button" id="btnClosePop" class="close">&times;</button></span>',

            content:  function(){

                //      add event popover html string
                return $compile('<div data-toggle="popover" class="event-popover">' +
                    'Whenever:<span data-ng-model="myDate"></span> '+ $scope.mydate +  '<br />Time: <input type="text" data-ng-model="eventstarttime"  class="texteventtime" id="eventstarttime"> &mdash; '+
                    '<input type="text" id="eventendtime2" data-ng-model="eventendtime" class="texteventtime"><br />' +
                    'What: <input type="text" id="eventtitle" value="" data-ng-model="eventtitle" class="texteventtitle"> <br />'+
                    'Where: <input type="text" data-ng-model="eventlocation" value="" id="eventlocation" class="texteventtitle"> <br />'+
                    '<span class="btn btn-default" id="btnSavePop">save</span></div>') ($scope)
                 //return $compile('<add-event-pop></add-event-pop>')($scope)

            }
        }).on('shown.bs.popover', function (e) {
            console.log(e.currentTarget);
                var $popup2 = $(this);
                //after popover is displayed attach close button event handler
                var $popup = $('#' + $(e.target).attr('aria-describedby'));
                $scope.currPopup = $popup;
                $popup.find('button.close').click(function (e) {
                    $popup2.removeAttr('aria-describedby');
                    $popup.popover('hide');
                });
                 // http://www.jqueryrain.com/   time picker
                $('#eventstarttime').datetimepicker({
                    datepicker:false,
                    format:'H:i',
                    allowTimes:[
                        '08:00', '08:30', '09:00','09:30','10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30','14:00','14:30',
                        '15:00','15:30','16:00','16:30','17:00', '17:30', '18:00'
                    ]
                });
                $('#eventendtime2').datetimepicker({
                    datepicker:false,
                    format:'H:i',
                    allowTimes:[
                       '08:00', '08:30', '09:00','09:30','10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30','14:00','14:30',
                        '15:00','15:30','16:00','16:30','17:00', '17:30', '18:00'
                    ]
                });

        });
     $scope.$watch ($scope.mydate, function(){
         console.log("watching mydate...");
     });

    }]);

offlineController.controller('popController',['$scope', 'PopService', function($scope, PopService){
       $scope.popLabel = PopService.popData;
    $scope.sendEvent = function(){
        console.log("click popController");
        PopService.eventService($scope.popLabel);
    }


}])
offlineController.directive('addEventPop',['$compile','PopService', function($compile, PopService){
    return{
        restrict: 'AE',
        template: '<span><input type="text" ng-model="mydate"></span> <span><span class="btn btn-default" id="sendEvent" ng-click="sendEvent()">save</span>label<input type="text" ng-model="label"></span>',
         scope:true,
        link: function (scope, el, attrs) {
            //scope.label = $parent.label;//"my directive"//attrs.popoverLabel;
             //scope.mydate = $parent.mydate;

            console.log("directive linking event...");
            scope.sendEvent = function(){
                PopService.eventService(scope.label);
                console.log("directive send event...");
            }
            scope.$watch(scope.label, function(){
                // scope.label = scope.label;
                console.log("directive watch...");
                $compile(el.contents())(scope);
             });

        }

    }
}]);

offlineController.factory('PopService', function($rootScope){
    return{
        popData: "",
        eventService:function(mdata){
             this.popData = mdata;
            $rootScope.$broadcast("eventAdded");
            console.log("broadcast..." + mdata);
        }
    }

})/*
    .directive('popOver',function(){
        return {
            restrict: 'A',
            template: '<span>{{label}}</span>',
            link: function (scope, el, attrs) {
                scope.label = attrs.popoverLabel;

                $(el).popover({
                    trigger: 'click',
                    html: true,
                    content: attrs.popoverHtml,
                    placement: attrs.popoverPlacement
                });
            }
        }
    });  */