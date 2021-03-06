'use strict';

module.exports = function($scope, $compile, PopService, $rootScope, utilS){
        window.offline = $scope;
        // scope variables
        $scope.oldEventsList = localStorage.getItem('offlineEvents');
        $scope.eventlocation = "";
        $scope.eventtitle = "";
        $scope.label = PopService.popData;// "controller label";
        $scope.eventendtime = "";
        $scope.eventstarttime = "";
        $scope.offlinemode = true;
        $scope.utilS = utilS;

        $("#btnGoOffline").hide();

        var eventCount = JSON.parse($scope.oldEventsList);
        console.log("init offlineController");
        //console.log(eventCount.length);
        console.log($scope.oldEventsList);
        if(eventCount !== null){
            $scope.offlineEventsCounter =  eventCount.length;
        }
        else{
            $scope.offlineEventsCounter = '0';
        }

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
        // initialize the fullCalendar instance
        $("#clientCal").fullCalendar({
           
            eventSources: [  //'https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic',
                            JSON.parse($scope.oldEventsList)
            ],
            // calendar top nav buttons
            header: {
                    left: 'prev, next, today',
                    center: 'title',
                    right: 'month, agendaWeek agendaDay'
            },
            // event handler for days, handles the event edit popover button click events
            dayClick : function(date,jsEvent, view){


                console.log("clicked on " + date.format() + jsEvent.target.id);
                
                var eventDate = date.format();
                $scope.initPop();
                if(jsEvent.target.id == "btnSavePop"){
                    $scope.savepop(eventDate);
                }

                if(jsEvent.target.id == "btnClosePop"){
                    $scope.closepop();
                }
                $scope.eventendtime = "";
                $scope.eventstarttime = "";
                $scope.eventstatus = "";
                $scope.mydate = date.format("ddd, MMM D, YYYY");
                $scope.eventdate = date.format();
                $scope.$digest();
                setTimeout( $scope.makePop(), 500);

            },
            eventRender: function (event, element) {
                         
            },
            // event handler for calendar event edit modal
            eventClick: function(event, jsEvent, view){
                var editable = true;
                $scope.editevent = event;
                $scope.editeventdate = event.start.format('YYYY-MM-DD');
                console.log("edit event date is " +event.source.url);

                if(event.source.url !== undefined){
                    editable = false;
                }
                $scope.$digest();
                $scope.openModal(event.title,event.description,event.location,event.start,event.end, editable);
            },
            // access to each calendar day's td element
            dayRender: function(date, cell){
            

            }
        });

        // opens edit event modal
        $scope.openModal = function (title, info, location, start, end, editable) {
            // find opened event index in localStorage
            var eventsList = localStorage.getItem('eventsList');
           
            eventsList = JSON.parse(eventsList);
            $scope.eventListJson =  eventsList;
            var eventid = moment($scope.editevent.start).format();
            var eventidStr = eventid.toString().slice(0,16);
            for(var i = 0; i < eventsList.length; i++){
                var eventidStr2 =  eventsList[i].start.toString().slice(0,16);
                
                if(eventidStr == eventidStr2){
                    console.log("opened... " + eventsList[i].title);
                    $scope.editEventIndex = i;
                    
                }
            }
            console.log("editable " +editable);
            $(".event-modal").modal();

            if(editable !== true){
                $("#btneventsave").attr('disabled', true);
                $("#btneventdelete").attr('disabled', true);
            }
            else{
                $("#btneventsave").attr('disabled', false);
                $("#btneventdelete").attr('disabled', false);
            }
            if (start && start != 'null') {
                $scope.txteventstartmodal =   moment(start).format('YYYY-MM-DD HH:mm');
                $("#txtEventStartModal").attr('placeholder',moment(start).format('YYYY-MM-DD HH:mm') );
                
            } else {
                $("#event-content").append(""); //no start (huh?) clear out previous info.
            }
            if (end && end != 'null')
            {
                $scope.txteventendmodal =   moment(end).format('YYYY-MM-DD HH:mm');
                $("#txtEventEndModal").attr('placeholder',moment(end).format('YYYY-MM-DD HH:mm') );
                
            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }
            if (location && location != 'null')
            {
                
                $scope.txteventlocationmodal = location;
            } else {
                $("#txtEventLocationtModal").attr('placeholder',"Enter Location here"); //no end. clear out previous info.
            }
            if (info && info != 'null')
            {
                
                $scope.txteventinfomodal = info;
            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }

            $("#event-title").html(title);

            //add time picker to remind hours
            $('#txtReminderDaysModal').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00', '09:00','10:00', '11:00', '12:00'
                ]
            });
            $('#txtReminderHoursModal').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00', '09:00','10:00', '11:00', '12:00'
                ]
            });
            $scope.$digest();
        }
        // clear modal content when it closes
        $('.event.modal').on('hidden.bs.modal', function (e) {
            console.log("close modal");

        })
         $('.close').click(function(){
             // $('.texteventtitle').val("");
             // $('.texteventtime').val("");
        })
        // clear modal content when close button clicked
        $(".close-modal").click(function(){
            console.log("close modal");

        });
        $("#btnGoOnline").click(function (){
            $("#offlineCal").hide();
            $("#onlineFrame").show();
            $("#btnGoOnline").hide();
            $("#btnGoOffline").show();
            $scope.offlinemode = false;
            $scope.onlinemode = true;
            console.log("going online...");

        });
        $("#btnGoOffline").click(function (){
            $("#offlineCal").show();
            $("#onlineFrame").hide();
            $("#btnGoOffline").hide();
            $("#btnGoOnline").show();
            $scope.offlinemode = true;
            $scope.onlinemode = false;
            console.log("going offline...");

        });
        $("#btnAddEvent").click(function (){
            chrome.tabs.create({url: "https://www.naijametro.com/calendar/index_web.html"})
            console.log("open tab...");
        });
        // delete current event from localStorage in event edit modal
        // delete event function tested and works, 8 November 2014
        $("#btneventdelete").click(function (){
            var eventsList = localStorage.getItem('offlineEvents');
            var eventsDelArr = new Array();
            eventsList = JSON.parse(eventsList);
            var eventid = moment($scope.editevent.start).format();
            var eventidStr = eventid.toString().slice(0,16);
            var eventTitle =  $scope.editevent.title;

              console.log("start deleting event..." +eventid + " str  " + eventTitle );
            for(var i = 0; i < eventsList.length; i++){
                var eventidStr2 =  eventsList[i].start.toString().slice(0,16);
                console.log (eventsList[i].title);
                if(eventidStr == eventidStr2){
                    //console.log("deleted event..." + eventsList[i].title);
                    $scope.eventdelete = eventsList[i];
                    eventsDelArr.push(eventsList[i]);
                    eventsList.splice(i,1);

                }
            }
            // create new eventslist  without the deleted event, remove null value from the list
            var newEventList = JSON.stringify(eventsList);
            var newEventList2 = newEventList.replace(/null,/g,"");
            localStorage.setItem('offlineEvents', newEventList2);
            // add new event source from newEventList to display in calendar when user clicks save

            $("#clientCal").fullCalendar('removeEvents');
            $("#clientCal").fullCalendar( {
                googleCalendarApiKey: "AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc",
                events: {  googleCalendarId: $scope.currentUserName}
            });
            $("#clientCal").fullCalendar('addEventSource',JSON.parse(newEventList2));
            $("#clientCal").fullCalendar('refetchEvents');
            $("#clientCal").fullCalendar('gotoDate',$scope.editeventdate);
            console.log("deleted event..." + $scope.editevent.title);
            console.log(newEventList2);

        });

        // cancel event edit in modal
        $("#btneventcancel").click(function (){
          console.log("cancel event edit modal");

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
                console.log("new event start " + editedEventObj.start) ;
              

            }
           console.log("save event edit modal" +  $scope.offlineEventEditForm.$valid);
        });

        // init event add popover
        $scope.initPop = function(){

            // add time picker to event end field
            $('.texteventtime').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '08:00', '08:30', '09:00','09:30','10:00','10:30', '11:00','11:30', '12:00','12:30', '13:00','13:30','14:00','14:30',
                    '15:00','15:30','16:00','16:30','17:00', '17:30', '18:00'
                ]
            });
            $('.texteventtime').focus(function(){
               console.log("focused on eventtime...");
                var timepicker = $('body').find('#eventstarttime').length;
                $('#eventstarttime').each(function(index){
                    console.log("there are " + timepicker + " id timepickers...");
                })
                $('.texteventtime').each(function(index){
                    var myId = $('.texteventtime').attr("id");
                    console.log("there are " + myId + " " +index + " class timepickers...");
                })
            });

            //add time picker to remind hours
            $('#remindhours').datetimepicker({
                datepicker:false,
                format:'H:i',
                allowTimes:[
                    '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00',  '09:00','10:00', '11:00', '12:00'
                ]
            });

        }  // end initPop

        // handle event add popover close button click
         $scope.closepop = function(){

             console.log("close popup...");
             $(".fc-day-content").popover('hide');

             console.log("go to date..." + $scope.eventdate);
         }
        $scope.$on("eventAdded", function(){
            console.log("broadcast rcvd "+PopService.popData);
            $scope.savepop();
        })
        // save new offline event from popover
         $scope.savepop = function(){
             //$scope.$digest();
             // create new event object

              var newEventObj = PopService.popData;
             console.log("new event obj " + JSON.stringify(newEventObj));

             // retrieve current event list from extension localStorage  if no localStorage create empty oeJson, seems to create a fake event with current time stamp
             if(localStorage.getItem('offlineEvents') !== null){
                 $scope.oldEventsList = localStorage.getItem('offlineEvents');
                 var oeJson = JSON.parse($scope.oldEventsList);
                 var oldeventCount = oeJson.length;
             }
               else{
                 oeJson = {};
                 var oldeventCount = 0;

             }
            
             $scope.newEventStr = JSON.stringify(newEventObj);
             if(oeJson.length !== undefined){
                 var inc = oeJson.length;
                 oeJson[inc] = newEventObj;
                 var newEventList =  JSON.stringify(oeJson);
             }

             else{
                 var eventArr = new Array();
                 eventArr[0] = newEventObj;
                 var newEventList =  JSON.stringify(eventArr);
             }

             //var newEventList =  JSON.stringify(oeJson);
             // create new localStorage item for newEventsList
             localStorage.setItem('offlineEvents', newEventList);
             $scope.newEventsList = localStorage.getItem('offlineEvents');
             console.log("stored new event list... " + $scope.newEventsList);
             var eventCount = JSON.parse($scope.newEventsList);

             //call PopService method to broadcast event added status
             if(eventCount.length == (oldeventCount +1) ){
                 PopService.eventStatus('success');
             }
             else{
                 PopService.eventStatus('fail');
             }
             $scope.offlineEventsCounter = eventCount.length;
           
             // add new event source from newEventList to display in calendar when user clicks save
             $("#clientCal").fullCalendar('removeEvents');
             $("#clientCal").fullCalendar( {
                 googleCalendarApiKey: "AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc",
                 events: {  googleCalendarId: $scope.currentUserName}
             });

             $("#clientCal").fullCalendar('addEventSource',JSON.parse($scope.newEventsList));
             $("#clientCal").fullCalendar('refetchEvents');
             $("#clientCal").fullCalendar('renderEvent',$scope.newEventStr, true);
             $("#clientCal").fullCalendar('gotoDate',$scope.eventdate);

         };


        $scope.makePop = function() {

        $('.fc-day-content').webuiPopover({
            title: 'Add Offline Event',
            closeable: true,
            content:function(){

                return $compile('<add-event-pop mydate="{{mydate}}" eventdate="{{eventdate}}" eventendtime="eventendtime" eventstarttime="eventstarttime" eventlocation="eventlocation" eventtitle="eventtitle" eventstatus="eventstatus"></add-event-pop>') ($scope)
                }
        });


        }

        // handle click on calendar day and show popover

    }]);

