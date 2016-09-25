'use strict';

/*
 onlineController for the Google Calendar component
 */

angular
.module('onlineModule')
.controller('onlineCtrl', [ '$scope', '$compile', 'googleLogin', 'googleCalendar', 'googlePlus', 'PopServiceOnline', '$rootScope', 'utilS','$interval',
    function ($scope, $compile, googleLogin, googleCalendar, googlePlus, PopServiceOnline, $rootScope, utilS, $interval) {
        console.log("init onlineController");
        window.onctrl = $scope;
        var clientId = '6761897143-ou9g6m0cedtmcp6hk8t3jbnnsqiavkc6.apps.googleusercontent.com';

        var apiKey = 'AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc';

        var scopes = 'https://www.googleapis.com/auth/calendar';

        $scope.oldEventsList = localStorage.getItem('eventsList');

        $scope.utilS = utilS;
        $scope.authenticated = false;
        $scope.gPlus = googlePlus;
        $scope.currentUser = "";
        $scope.addeventspinner = false;
        $scope.localTimeZone = "Africa/Lagos";
        moment.tz.add("Africa/Bangui|LMT WAT|-d.A -10|01|-22y0d.A");
        moment.tz.link('Africa/Bangui|Africa/Lagos');
        $scope.$on("google:authenticated", function (authResult) {

            $scope.$on('googlePlus:loaded', function () {
                // listen for googlePlus:loaded broadcast from angulargoogleapi.js and display currentUser, hide login link
                $scope.currentUser = $scope.gPlus.currentUser;
                $scope.currentUserEmail = $scope.gPlus.currentUserEmail;
                var emailIndex = $scope.currentUserEmail.indexOf('@');
                $scope.currentUserName = $scope.currentUserEmail.substr(0, emailIndex );
                console.log("current user is " + $scope.currentUserName);
                var authorizeButton = document.getElementById('authorize-button');
                //var syncButton = document.getElementById('btnSyncEvent');
                if (authResult.error == undefined || authResult.error == "") {
                    authorizeButton.style.visibility = 'hidden';
                    $scope.$apply();

                } else {
                    authorizeButton.style.visibility = '';

                }

            })
            // after user logs in set authenticated to true to toggle login link and currentUser display
            $scope.authenticated = true;

            $scope.$on('googleCalendar:loaded', function () {
                console.log("googleangularapi authenticated...");

                $scope.$apply();
            });
        });

        function checkAuth() {
            console.log("checking auth..");
            setTimeout(function () {
                gapi.auth === undefined ? checkAuth() : googleLogin.checkAuth();
            }, 1000);
        };

        function checkLogin() {
            console.log("checking auth..");
            setTimeout(function () {
                gapi.auth === undefined ? checkLogin() : googleLogin.checkLogin();
            }, 20);
        }
        $scope.$on('googleCalendar:apibuilder', function () {
            console.log("hide spinner");
            setTimeout(function(){
                $scope.addeventspinner = false;
                $("#reminderStatus").html("your reminder  has been saved");
                $scope.$apply();
            },2000)



        });

        $(document).ready(function () {
            checkAuth();
            var url = "https://apis.google.com/js/client.js";
            $.getScript(url)
                .done(function (script, textStatus) {
                    console.log("loading client.js... " + textStatus);
                    //$scope.handleClientLoad();
                });

            $scope.loginClick = function () {

                googleLogin.login();
                console.log("clicked login...");
            }
            $("#signIn").click(function (event) {
                console.log("clicked google login");
                //event.preventDefault();
            });
            $scope.handleClientLoad = function () {
                //gapi.client.setApiKey(apiKey);
                window.setTimeout($scope.checkAuth, 1000);
                //checkAuth();
            }

            $scope.checkAuth = function () {
                // if(gapi.load){
                // $("#clientCal").fullCalendar('addEventSource', calObj.jsonEvents);
                gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, $scope.handleAuthResult);
                console.log("checking auth online..." + clientId);
                //  }
            }

            $scope.handleAuthResult = function (authResult) {
                var authorizeButton = document.getElementById('authorize-button');
                //var syncButton = document.getElementById('btnSyncEvent');
                console.log("auth result online" + authResult);
                if (authResult.error == undefined || authResult.error == "") {
                    authorizeButton.style.visibility = 'hidden';
                    // syncButton.style.visibility = '';
                    gapi.client.setApiKey(apiKey);
                    console.log("online and making API call");
                    // location.reload();
                    $scope.currentUser = $scope.gPlus.getCurrentUser();
                    console.log("current user " + $scope.currentUser.displayName);
                    //$scope.makeApiCall();
                } else {
                    console.log("authresult error... " + authResult.error)
                    authorizeButton.style.visibility = '';
                    //syncButton.style.visibility = '';
                    authorizeButton.onclick = $scope.handleAuthClick(e);
                }
            }
            $scope.handleAuthClick = function (event) {
                gapi.auth.authorize(
                    {client_id: clientId, scope: scopes, immediate: false},
                    handleAuthResult);
                // gapi.client.setApiKey(apiKey);
                // makeApiCall();
                return false;
            }
            $scope.makeApiCall = function () {
                var resource = {
                    "summary": "Blog entry",
                    "location": "3450 Roswell Road, Atlanta, GA 30357",
                    "start": {
                        "dateTime": "2014-09-16T10:00:00.000-07:00"
                    },
                    "end": {
                        "dateTime": "2014-09-16T10:25:00.000-07:00"
                    }
                };
                gapi.client.load('calendar', 'v3', function () {
                    var request = gapi.client.calendar.events.list({
                        'calendarId': 'primary'
                    });

                    var request2 = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': resource
                    });
                    // request2.execute(function(resp) {
                    //    console.log("inserting event... "+ resp);
                    //  });
                    request.execute(function (resp) {
                        console.log("events data: " + resp.items);
                        for (var i = 0; i < resp.items.length; i++) {
                            var li = document.createElement('li');
                            li.appendChild(document.createTextNode(resp.items[i].summary));
                            li.appendChild(document.createTextNode(" - "));
                            li.appendChild(document.createTextNode(resp.items[i].start.dateTime));
                            li.appendChild(document.createTextNode(resp.items[i].location));
                            li.appendChild(document.createTextNode(resp.items[i].id));
                            // document.getElementById('events').appendChild(li);
                        }
                        this.eventsData = JSON.stringify(resp.items);
                        //  calObj.saveEvents();
                        calObj.loadEvents();
                    });
                });
            }

            $("#btnDownloadEvents").click(function () {
                var googleEvents = googleCalendar.listEvents({calendarId: 'primary'}).then(function (resp) {
                    //console.log(JSON.stringify(resp));

                    for (var i = 0; i < resp.length; i++) {
                        console.log(resp[i].summary);
                        var start2 = resp[i].start.dateTime;
                        delete resp[i].start;
                        resp[i].start = start2;

                        var end2 = resp[i].end.dateTime;
                        delete resp[i].end;
                        resp[i].end = end2;
                        // event.end = event.end.dateTime;
                    }
                    $scope.downloaddata = JSON.stringify(resp);
                    console.log("new event objects... " + $scope.downloaddata);
                    localStorage.setItem('googleCalEvents', $scope.downloaddata);
                    $("#btnDownloadEvents").trigger("downloadReady", [$scope.downloaddata]);
                });


                console.log("google Events... " + googleEvents);
            });
            $("#btnDownloadEvents").on("downloadFinished", function(event,data){
                $(".sync-modal").modal();
                 console.log("downloadFinished rcvd");
                console.log("online JSON" + data);
                var eventObj = JSON.parse(data);
                var syncEventTitle = "";
                if(eventObj.length > 0){
                    $scope.syncStatus = "syncing events please wait";
                }
                   else{
                    $scope.syncStatus = "no events to sync";
                }
                $scope.count = 0;
                $scope.syncEventsArr = [];
                var totalSyncIndex = $scope.totalOnlineevents = eventObj.length - 1;
                //for (var i = 0; i < totalSyncIndex; i++) {

                    $interval(function(){
                      console.log("count is " + $scope.count);
                        if(typeof eventObj[$scope.count].title !== "undefined"){
                            $scope.syncEventsArr.push((eventObj[$scope.count].title));
                            console.log("sync event success... "  + JSON.stringify(eventObj[$scope.count].title));
                            if($scope.count == $scope.totalOnlineevents - 1) {
                                $scope.syncStatus = "sync complete";
                            }
                        }
                        else{
                            $scope.syncEventsArr.push((eventObj[$scope.count].summary));
                            if($scope.count == $scope.totalOnlineevents - 1) {
                                $scope.syncStatus = "sync complete";
                            }
                            console.log("sync event success summary... "  + JSON.stringify(eventObj[$scope.count].summary));
                        }
                        $scope.count++;
                    }, 1000, $scope.totalOnlineevents);

               // }

            })
            // uploadReady event is triggered from calendar_web.js data is offlineEvents from localStorage
            $("#btnUploadEvents").on("uploadReady", function (event, data) {
                //  var offlineEventsObj = JSON.parse(data);
                $(".sync-modal").modal();
                console.log("offline JSON" + data);
                var eventObj = JSON.parse(data);
                var syncEventTitle = "";
                if(eventObj.length > 0){
                    $scope.syncStatus = "syncing events please wait";
                }
                else{
                    $scope.syncStatus = "no events to sync";
                }
                var count = 0;
                $scope.syncEventsArr = [];
                var totalSyncIndex =  eventObj.length;
                console.log(eventObj + " " + eventObj.length);
                for (var i = 0; i < totalSyncIndex; i++) {
                    var endtime = eventObj[i].end;
                    var starttime = eventObj[i].start;
                    console.log("insert event1... " + JSON.stringify(eventObj[i].title));

                    delete eventObj[i].start;
                    delete eventObj[i].end;
                    eventObj[i].end = {};
                    eventObj[i].start = {};
                    eventObj[i].end.dateTime = endtime;
                    eventObj[i].start.dateTime = starttime;
                    console.log("insert event2... " + JSON.stringify(eventObj[i].start));
                    googleCalendar.createEvent({
                        'calendarId': 'primary',
                        'resource': eventObj[i]
                    })
                        .then(function(ev){

                            if(typeof eventObj[count].title !== "undefined"){
                                $scope.syncEventsArr.push((eventObj[count].title));
                                console.log("sync event success... "  + JSON.stringify(eventObj[count].title));
                                count++;
                                if(count == totalSyncIndex) {
                                    $scope.syncStatus = "sync complete";
                                }
                            }
                            else{
                                $scope.syncEventsArr.push((eventObj[count].summary));
                                count++;
                                if(count == totalSyncIndex) {
                                    $scope.syncStatus = "sync complete";
                                }
                                console.log("sync event success summary... "  + JSON.stringify(eventObj[count].summary));
                            }



                        }, function(){
                            count++;
                            console.log("sync event fail... " + JSON.stringify(eventObj[count].title));
                            if(count == totalSyncIndex) {
                                $scope.syncStatus = "sync complete";
                            }
                        });
                    console.log("insert event... " + JSON.stringify(eventObj[i]));
                }

            });
             // trigger readyForUpload listener is on calendar_web.js
            $("#btnUploadEvents").click(function () {
                //setTimeout(uploadEvents, 500);
                $("#btnUploadEvents").trigger("readyForUpload");
                // console.log("google Events... " + JSON.stringify(googleEvents));


            });

            function uploadEvents() {
                var offlineEvents = localStorage.getItem('offlineEvents');
                console.log("offline events... angular" + offlineEvents);
            }
            $scope.$on('googlePlus:loaded', function () {
                $scope.currentUser = $scope.gPlus.currentUser;
                $scope.currentUserEmail = $scope.gPlus.currentUserEmail;
                var emailIndex = $scope.currentUserEmail.indexOf('@');
                $scope.currentUserName = $scope.currentUserEmail;//.substr(0, emailIndex );
                console.log("init fullCalendar for " + $scope.currentUserName);
                var googleEvents = googleCalendar.listEvents({calendarId: 'primary'}).then(function (resp) {
                    console.log("you have" + resp.length + "online events");
                    $scope.onlineEventsCounter = resp.length;
                });

            $("#clientCal2").fullCalendar({
                googleCalendarApiKey: "AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc",
                events: {  googleCalendarId: $scope.currentUserName, googleCalendarApiKey: "AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc"},
                header: {
                    left: 'prev, next, today',
                    center: 'title',
                    right: 'month, agendaWeek agendaDay'
                },
                dayClick: function (date, jsEvent, view) {

                    console.log("online controller clicked on " + date.format() + calObj.jsonEvents);
                    $scope.eventdate = date.format();
                    $scope.mydate = date.format("ddd, MMM D, YYYY");
                    $scope.initPopover();
                    if (jsEvent.target.id == "btnSavePop") {
                        $scope.addevent();
                    }

                    if (jsEvent.target.id == "btnClosePop2") {
                        $scope.closepop2();
                    }
                    $scope.$digest(); // need to digest the controller not sure why but wont work without this line
                    setTimeout($scope.makePop(), 500);
                },
                // event handler for calendar event edit modal
                eventClick: function (event, jsEvent, view) {
                    jsEvent.preventDefault();
                    $scope.editevent = event;
                    $scope.editeventid = event.id;
                    $scope.editeventdate = event.start.format('YYYY-MM-DD');
                    console.log("edit event date is " + $scope.editeventdate);
                    $scope.$digest();
                    $scope.openModal(event.title, event.description, event.location, event.start, event.end);
                }
            });

            });

            $("#btnAddEvent").click(function (e) {
                console.log("clicked add online to list events");
                /*  googleCalendar.listEvents( {
                 'calendarId': 'primary'
                 }) */
            });
        })    // document ready close

        $scope.$on("eventAdded", function () {
            $scope.newPopEventObj = PopServiceOnline.popData;
            console.log("broadcast rcvd " + JSON.stringify(PopServiceOnline.popData));

            $scope.addevent();
        })

        // save new event to google calendar
        $scope.addevent = function () {
            // create new event object
            $scope.eventstartDateTime = $scope.eventdate + " " + $scope.eventstarttime;
            var newEventObj = {};
            newEventObj.summary = $scope.newPopEventObj.title;
            newEventObj.location = $scope.newPopEventObj.location;
           var startDateTime = $scope.eventdate + "T" + $scope.newPopEventObj.start + ":00+00:00";   // add :00 for google calendar time format
           var endDateTime = $scope.eventdate + "T" + $scope.newPopEventObj.end  + ":00+00:00";

            newEventObj.start = {};
            newEventObj.end = {};
            newEventObj.start.dateTime = startDateTime;
            newEventObj.end.dateTime = endDateTime;

            if ($scope.authenticated) {
                googleCalendar.createEvent({
                    'calendarId': 'primary',
                    'resource': newEventObj
                })
                    .then(function(){
                        console.log("event added success");
                        $("#clientCal2").fullCalendar('removeEvents');
                        $("#clientCal2").fullCalendar( {
                            googleCalendarApiKey: "AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc",
                            events: {  googleCalendarId: $scope.currentUserName}
                        });

                        $("#clientCal2").fullCalendar('refetchEvents');
                        //$("#clientCal2").fullCalendar('renderEvent',$scope.newEventStr, true);
                        $("#clientCal2").fullCalendar('gotoDate',$scope.eventdate);
                        PopServiceOnline.eventStatus('success');
                    }, function(){
                        PopServiceOnline.eventStatus('fail');
                        console.log("event not added failure");
                    });
            }
            else {
                console.log("you must me logged in to add events");
            }

            console.log("online inserting event... " + JSON.stringify(newEventObj));
            // $scope.sendSMS();

        }

        // adds event alert to mySQL database
        $scope.sendSMS = function () {
            var smsUrl = "https://www.naijametro.com/calendar/php/addevent.php";
            var hoursbefore = $scope.txtreminderhoursmodal.substr(0, 2);
            var remindDateTime = moment($scope.eventEditStartDateTime, "YYYY-MM-DD HH:mm").subtract(hoursbefore, "hours").format('YYYY-MM-DD HH:mm');
            console.log("remind me at.. " + remindDateTime);
            if(remindDateTime == "Invalid date"){
                $("#reminderStatus").html("invalid date format");
                return;
            }
            var eventData = {};
            eventData.smsMessage = "AutoCal alert: " + $scope.editevent.title + " at " + moment($scope.eventEditStartDateTime, "YYYY-MM-DD HH:mm").format('ddd, MMM D YYYY, h:mm a');// $("#smsMessage").val();
            eventData.eventDate = remindDateTime;//$("#eventDate").val();
            eventData.cellPhone = $scope.txtreminderphonemodal;//$("#cellPhone").val();

            $.post(smsUrl, eventData, function (data) {
                console.log("adding event... " + data);
            }).
            done(function(){
                $("#reminderStatus").html("Please wait, saving reminder...");
                    console.log("reminder added success");
            }).
            fail(function(){
                    $("#reminderStatus").html("error saving reminder. try again later");
                    console.log("reminder added fail");
            });
        };
        $("#btnSaveOnlineModal").click(function (e) {
            console.log("clicked save online to list events");
            $scope.addeventspinner = true;
            var eventIdLength = $scope.editeventid.indexOf('@');
            var editStart = $scope.txteventstartmodal;
            var editEnd = $scope.txteventendmodal;
            var eventId = $scope.editeventid.replace(/@google.com/i, "");
            var editEventObj = {};
            editEventObj.summary = $scope.editevent.title;
            editEventObj.start = {};
            editEventObj.end = {};
            editEventObj.start.dateTime = moment.tz(editStart, 'YYYY-MM-DD HH:mm', $scope.localTimeZone).format();
            editEventObj.end.dateTime = moment.tz(editEnd, 'YYYY-MM-DD HH:mm', $scope.localTimeZone).format();
            editEventObj.location = $scope.txteventlocationmodal;
            $scope.eventEditStartDateTime  =  editEventObj.start.dateTime;
            $scope.$apply();
            googleCalendar.updateEvent({
                'calendarId': 'primary',
                'eventId': eventId,
                'resource': editEventObj
            });
            if ($scope.txtreminderphonemodal) {
                $scope.sendSMS();
            }
        });

        // opens edit event modal
        $scope.openModal = function (title, info, location, start, end) {

            $("#reminderStatus").html("");
            if (start && start != 'null') {
                $scope.txteventstartmodal = moment(start).format('YYYY-MM-DD HH:mm');
                // $("#txtEventStartModal").attr('placeholder',moment(start).format('MMMM Do YYYY, h:mm:ss a') );
                $("#txtEventStartModal").attr('placeholder', moment(start).format('YYYY-MM-DD HH:mm'));

            } else {
                $("#event-content").append(""); //no start (huh?) clear out previous info.
            }
            if (end && end != 'null') {
                $scope.txteventendmodal = moment(end).format('YYYY-MM-DD HH:mm');
                //$("#txtEventEndModal").attr('placeholder',moment(end).format('MMMM Do YYYY, h:mm:ss a') );
                $("#txtEventEndModal").attr('placeholder', moment(end).format('YYYY-MM-DD HH:mm'));

            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }

            if (location && location != 'null') {
                $scope.txteventlocationmodal = location;
                $("#txtEventLocationModal").attr('placeholder', location);

            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }

            if (info && info != 'null') {
                $scope.txteventinfomodal = info;
                $("#txtEventInfoModal").attr('placeholder', info);

            } else {
                $("#event-content").append(""); //no end. clear out previous info.
            }

            $("#event-title").html(title);

            //add time picker to remind hours
            $('#txtReminderHoursModal').datetimepicker({
                datepicker: false,
                format: 'H:i',
                allowTimes: [
                    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'
                ]
            });
            $(".event-modal").modal()
                .on('shown-bs-modal', (function (e) {
                    console.log("open modal event fired");
                    $("#btnSaveOnlineModal").click(function (e) {
                        console.log("clicked save online to list events");
                        /*  googleCalendar.listEvents( {
                         'calendarId': 'primary'
                         }) */
                    });

                })
                )

            $scope.$digest();  // bind scope variables to modal when it opens


        } // end openmodal


        $(".close-modal").click(function(){
            console.log("close modal btn click");
            $("#reminderStatus").html("");

        });

        $("#btneventcancel").click(function(){
            console.log("close modal btn click");
            $("#reminderStatus").html("");

        });
        // init event add popover
        $scope.initPopover = function () {

            // add time picker to event start text field
            $('texteventtime').datetimepicker({
                datepicker: false,
                format: 'H:i',
                allowTimes: [
                    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
                ]
            });

            //add time picker to remind hours
            $('#remindhours').datetimepicker({
                datepicker: false,
                format: 'H:i',
                allowTimes: [
                    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'
                ]
            });


        }       // end initPop

        $scope.makePop = function () {
            $scope.eventendtime = "";

            $('.fc-widget-content').webuiPopover({
                title: 'Add Online Event',
                closeable: true,
                content: function () {
                    console.log("online popover directive compile");
                    return $compile('<add-event-pop-online mydate="{{mydate}}" eventdate="{{eventdate}}" eventendtime="eventendtime" eventstarttime="eventstarttime" eventlocation="eventlocation" eventtitle="eventtitle" eventstatus="eventstatus"></add-event-pop-online>')($scope)
                    //$scope.refresh()
                    // $scope.$digest();
                }
            });

            console.log("makePop online");

            console.log("event list... " + $scope.eventendtime);


        }
        $scope.$watch($scope.currentUser, function () {
            $("#currentuser").html = "user " + $scope.currentUser;
            console.log("watching user  " + $scope.currentUser);
            // $scope.$digest();
        });

    }]);



//broadcast service linking offlineController with addEventPop directive
onlineController.factory('PopServiceOnline', function ($rootScope) {
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

})
