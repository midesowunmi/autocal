/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 8/9/14
 * Time: 9:31 AM
 * To change this template use File | Settings | File Templates.
 */

/*
Google Calendar API client code. Handles authentication and calls to API using the javascript client library

 */

//var clientId = '6761897143-ou9g6m0cedtmcp6hk8t3jbnnsqiavkc6.apps.googleusercontent.com';

var apiKey = 'AIzaSyAEIXWXcr8Oyj5ixFoz9apKPr0flPBV5oc';

var scopes = 'https://www.googleapis.com/auth/calendar';
var smsUrl = "https://api.twilio.com/2010-04-01/Accounts/AC9a0f09ecdbcb532036a8b9ca1c617cb2/Messages.json";
var smsMsg = '{"account_sid": "AC9a0f09ecdbcb532036a8b9ca1c617cb2",' +
    '"api_version": "2010-04-01",' +
    '"body": "Test message from Twilio API",' +
    '"num_segments": "1",' +
    '"num_media": "1",' +
    '"date_created": "Sat, 23 Aug 2014 20:01:40 +0000",' +
    '"date_sent": null,' +
    '"date_updated": "Sat, 23 Aug 2014 20:01:40 +0000",' +
    '"direction": "outbound-api",' +
    '"error_code": null,' +
    '"error_message": null,' +
    '"from": "+14043416353",' +
    '"price": null,' +
    '"sid": "MM90c6fc909d8504d45ecdb3a3d5b3556e",' +
    '"status": "queued",' +
    '"to": "+17709105521",' +
    '"uri": "/2010-04-01/Accounts/AC9a0f09ecdbcb532036a8b9ca1c617cb2/Messages/MM90c6fc909d8504d45ecdb3a3d5b3556e.json"}';
//document.domain = "naijametro.com";
//chrome-extension://bkejgnogefabndejkplmiifmlnefnikm
//chrome-extension://ndajhgakfljpkaecidonlliocbmcicll   old id
var newEvent2 = {
    "summary": "Sandy Springs BusinessWeek Conference",
    "location": "225 Old Bond Street, London, United Kingdom",
    "start": "2014-09-29T10:00:00.000-07:00",
    "end":  "2014-09-29T10:25:00.000-07:00",
    "sequence": 0
};


/**
 *
 * @param e
 */
window.onmessage = function(e) {
 //cekfjfddodeidjhomcokekidhhpnifkb   autoReminder
 // bkejgnogefabndejkplmiifmlnefnikm   autoCal
 // aikibgommpofikkbodjpklpajdefaaod autoCalReminder App
 //oodllpkkocgilomgkkahobcedmfphdjg   autoCalReminder Test
    if (e.origin !== "chrome-extension://aikibgommpofikkbodjpklpajdefaaod") {
        console.log("message from another domain..."+ e.origin);
        return;
    }
    console.log("got your message buddy");
    // set payload from offline localStorage and set to online localStorage
    // get means send download  data from online to offline calendar
    if(e.data.method !== ""){
        //var payload = JSON.parse(e.data);
        var payload = e.data;
        var eventList =  payload.data;//JSON.stringify(payload.data) ;

    }

    var download = {};
      switch(payload.method) {
          // gets message from calobj.js method set and triggers uploadReady listener is in onlinecontroller.js
        case 'set':
            localStorage.setItem(payload.key, JSON.stringify(payload.data));
           // $("#clientCal").fullCalendar('addEventSource', payload.data);
           // $("#clientCal").fullCalendar('renderEvents');
            console.log("... adding local events ... reading localStorage");
            if(payload.key == 'offlineEvents'){
                console.log("receive offline events" + payload.data);
                $("#btnUploadEvents").trigger("uploadReady",[ payload.data]);
            }

            break;
        case 'get':
            var parent = window.parent;

            download.data = localStorage.getItem(payload.key);
            download.key = 'googleCalEvents';
            console.log("data from iframe... " + data);
            parent.postMessage(download, "*");

            break;
        case 'remove':
            localStorage.removeItem(payload.key);
            break;
    }
};

$( window ).load(function(){

    $("#btnDownloadEvents").on("downloadReady",function(event, data){

        var parent = window.parent;
        var download = {};
        download.key = 'googleCalEvents';
        download.method = 'set';
        download.data = data;// localStorage.getItem(download.key);

        parent.postMessage(download, "*");
        console.log("downloadReady rcvd and saved on server");
        $("#btnDownloadEvents").trigger("downloadFinished",[download.data]);
    });

    //receives readyForUpload from calobj.js online app and gets the offline Events from localStorage  in calobj.js
    $("#btnUploadEvents").on("readyForUpload",function(event){
        console.log("ready for upload");
        var upload ={};
        upload.method = 'get';
        upload.key = 'offlineEvents';
        parent.postMessage(upload, "*");
    })



    $("#btnUploadEvents").click(function(){
        var parent = window.parent;
        var upload = {};
        upload.key = "offlineEvents";
        upload.method = 'get';
        console.log("upload event clicked");
    });

   // var url = "https://apis.google.com/js/plusone.js";
    var url = "https://apis.google.com/js/client.js";
    $.getScript(url)
        .done(function(script, textStatus){
            console.log(textStatus);
            //handleClientLoad();
        });
    /*$("#clientCal").fullCalendar({
        events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"},

        dayClick : function(date,jsEvent, view){

            console.log("clicked on " + date.format() + calObj.jsonEvents)
        }
    });  */
    $(".fc-event-container a").attr("href", "#");
    $("a").click(function(event){
        console.log("clicked link");
        //event.preventDefault();
    });
    $("#signIn").click(function(event){
        console.log("clicked google login");
        //event.preventDefault();
    });
    $("#btnSaveEvent").click(function(){
        chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
            console.log("response from chrome.. " + response.farewell);
        });
    });
    $("#btnFormat").click(function(){
       var myData = $("#rawData").val();

       // var myTime = moment(myData).format("dddd, MMMM Do YYYY, h:mm:ss a");
      //  var myTime = moment(myData).format("HH:mm:ss Z");
        var smsUrl = "https://www.naijametro.com/calendar/php/sendsms.php";

        var smsData = {};
        smsData.from = "+14043416353";
        smsData.to = "+17709105521";
        smsData.textMessage = $("#rawData").val();
        $.post( smsUrl,smsData, function( data ) {
        console.log( "SMS sent: " + data);
    });
       //console.log("format time " + myTime);
        $("#btnAddEvent").click(function(){
             // var myTime = moment(myData).format("dddd, MMMM Do YYYY, h:mm:ss a");
            //  var myTime = moment(myData).format("HH:mm:ss Z");
            var smsUrl = "https://www.naijametro.com/calendar/php/addevent.php";

            var eventData = {};
            eventData.smsMessage =  $("#smsMessage").val();
            eventData.eventDate =  $("#eventDate").val();
            eventData.cellPhone =  $("#cellPhone").val();

            $.post( smsUrl,eventData, function( data ) {
                console.log( "adding event... " + data);
            });
        });

    });
});
/*function handleClientLoad() {
    //gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1000);
    //checkAuth();
}

function checkAuth() {
   // if(gapi.load){
    $("#clientCal").fullCalendar('addEventSource', calObj.jsonEvents);
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
  //  }
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    //var syncButton = document.getElementById('btnSyncEvent');
    if (authResult.error == undefined || authResult.error == "") {
        authorizeButton.style.visibility = 'hidden';
       // syncButton.style.visibility = '';
        gapi.client.setApiKey(apiKey);
        calObj.makeApiCall();
    } else {
        authorizeButton.style.visibility = '';
        //syncButton.style.visibility = '';
        //authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: clientId, scope: scopes, immediate: false},
        handleAuthResult);
   // gapi.client.setApiKey(apiKey);
   // makeApiCall();
    return false;
}    */
