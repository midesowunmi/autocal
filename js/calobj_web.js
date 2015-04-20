/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 9/1/14
 * Time: 8:25 AM
 * To change this template use File | Settings | File Templates.
 */
    // online calobj event handlers for logged in user
var newEvent = {
    "summary": "Bloomberg BusinessWeek Conference",
    "location": "221 Old Bond Street, London, United Kingdom",
    "start": {
        "dateTime": "2014-09-19T10:00:00.000-07:00"
    },
    "end": {
        "dateTime": "2014-09-19T10:25:00.000-07:00"
    },
    "sequence": 0
};
var  calObj = {
    eventsData: "",
    key: "eventsList",
    syncEvents: function(){
        var eventsLocal = localStorage.getItem(this.key);
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

        var request2 = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
           'resource': this.jsonEvents
        });
        //request2.execute(function(resp) {
            console.log("inserting event... "+ obj);
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
            console.log("deleting event... "+ resp);
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

}
