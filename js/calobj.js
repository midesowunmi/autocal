/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 9/1/14
 * Time: 8:25 AM
 * To change this template use File | Settings | File Templates.
 */
    // offline calobj event handler for chrome extension


var newEvent = {
    "summary": "Bloomberg BusinessWeek Conference",
    "location": "221 Old Bond Street, London, United Kingdom",
    "start": {
        "dateTime": "2014-09-29T10:00:00.000-07:00"
    },
    "end": {
        "dateTime": "2014-09-29T10:25:00.000-07:00"
    },
    "sequence": 0
};
window.onmessage = function(e) {
    var win = document.getElementsByTagName('iframe')[0].contentWindow;
    if (e.origin !== "https://www.naijametro.com") {
        console.log("message from wrong domain offline" + e.origin);
        return;
    }
     var upload = {};
    //console.log("loading from online storage " + JSON.parse(e.data));
    var download = e.data;
    switch(download.method) {
        case 'set':
            localStorage.setItem(download.key, download.data);
            //$("#clientCal").fullCalendar('addEventSource', download.data);
           // $("#clientCal").fullCalendar('renderEvents');
            console.log("... adding local events from server ... " + download.data);
            break;
        //receive   get message from calendar_web.js online and send the localStorage offlineEvents to calendar_web.js
        case 'get':
            var parent = window.parent;
            upload.data = localStorage.getItem(download.key);
            upload.method = 'set';
            upload.key = 'offlineEvents';

            console.log("getting offline events.. ");
            win.postMessage(upload, "*");
            break;
        case 'remove':
            localStorage.removeItem(payload.key);
            break;
    }
};

var  calObj = {
    eventsData: "",
    key: "offlineEvents",
    syncEventsUpload: function(){
        //var eventsLocal = localStorage.getItem(this.key);
        var win = document.getElementsByTagName('iframe')[0].contentWindow;
        var obj =  JSON.parse(localStorage.getItem(this.key));
        win.postMessage(JSON.stringify({key: 'googleCalEvents', method: "get"}), "*");

    },

    // add events to localStorage
    addEvents: function (){
        localStorage.setItem(this.key, JSON.stringify(newEvents));
    },
    //clear all events on localStorage
    clearEvents: function(){
        localStorage.clear();
    },
    //load events from localStorage
    loadEvents: function (){
        var eventsLocal = localStorage.getItem(this.key);
        if(eventsLocal != null){
            this.eventsJson = JSON.parse(eventsLocal);
            for (var i = 0; i < this.eventsJson.length; i++){
                console.log("reading from localStorage... " + this.eventsJson[i].summary)
            }
        }
        // return eventsJson;
    },
    //save events to Google calendar  from localStorage
    saveEvents: function (){
        this.jsonEvents = JSON.parse(localStorage.getItem(this.key));
        var win = document.getElementsByTagName('iframe')[0].contentWindow;
        var obj =  JSON.parse(localStorage.getItem(this.key));

        win.postMessage(JSON.stringify({key: 'storage', method: "set", data: obj}), "*");
        // load previously saved data

        //var request2 = gapi.client.calendar.events.insert({
        //    'calendarId': 'primary',
       //     'resource': this.jsonEvents
       // });
        //request2.execute(function(resp) {
            console.log("inserting event... " + obj);
        //});
    },
    //update events on google calendar
    updateEvents: function (){
        this.jsonEvents = JSON.parse(localStorage.getItem(this.key));
        var request = gapi.client.calendar.events.update({
            'calendarId': 'primary',
            'eventId': '4b92glau8lh6dmjdercs7cqhjc',
            'resource': newEvent
        });
        request.execute(function(resp) {
            console.log("updating event... "+ resp);
        });
    },
    // delete events from google calendar
    deleteEvents: function(){
        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': '5i8o499qqhi71mdu093se113l8'
        });

        request.execute(function(resp) {
            console.log("deleting event from calendar... "+ resp);
        });
    },
    // Insert the JS from above, here.
    // test google calendar API call gets events list and displays in DOM
    makeApiCall: function () {
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
        gapi.client.load('calendar', 'v3', function() {
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
            request.execute(function(resp) {
                console.log("events data: " + resp.items);

                this.eventsData = JSON.stringify(resp.items);
                //  calObj.saveEvents();
                calObj.loadEvents();
            });
        });
    }

}
