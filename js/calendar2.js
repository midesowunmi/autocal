/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 8/9/14
 * Time: 9:31 AM
 * To change this template use File | Settings | File Templates.
 */

/*
Google Calendar API client code. Handles authentication and calls to API using the javascript client library
Offline calendar javascript loads google JS API, handles sync events in conjuction with the online iFrame and checks Auth status

 */

var clientId = '6761897143-i2krk5ml61frprgheqef1ghle4pgted8.apps.googleusercontent.com';
var clientId = '6761897143-ou9g6m0cedtmcp6hk8t3jbnnsqiavkc6.apps.googleusercontent.com';
var clientId = '6761897143-d5lar02fumfmctlp2f10lle0lp3d5lsa.apps.googleusercontent.com';

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

$( window ).load(function(){
   // var url = "https://apis.google.com/js/plusone.js";
    var url = "../lib/client.js";
    $.getScript(url)
        .done(function(script, textStatus){
            console.log("offline status is " + textStatus);
            handleClientLoad();
        });
    $("#clientCal").fullCalendar({
        events: { url :"https://www.google.com/calendar/feeds/midethesis%40gmail.com/public/basic",  backgroundColor: "#f44"},

        dayClick : function(date,jsEvent, view){

            console.log("clicked on " + date.format() + calObj.jsonEvents)
        }
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
function handleClientLoad() {
    //gapi.client.setApiKey(apiKey);
    console.log("handle client load...");
    window.setTimeout(checkAuth,1000);
    //checkAuth();
}

function checkAuth() {
    $("#clientCal").fullCalendar('addEventSource', calObj.jsonEvents);
    var authorizeButton = document.getElementById('authorize-button');
    authorizeButton.onclick = handleAuthClick;
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
    console.log("checking auth after loading client...");
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    //var syncButton = document.getElementById('btnSyncEvent');

    console.log("call handle auth result...");
    if (authResult.error == undefined || authResult.error == "") {
        console.log("authresult error is " +authResult.error);
        authorizeButton.disabled = true;

        gapi.client.setApiKey(apiKey);
        calObj.makeApiCall();
    } else {
        //authorizeButton.disabled = true;
        authorizeButton.style.visibility = '';
        //syncButton.style.visibility = '';
        console.log("authresult error is " +authResult.error);
        console.log("ready to click login button");
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: clientId, scope: scopes, immediate: false},
        handleAuthResult);
    console.log("click login button");
   // gapi.client.setApiKey(apiKey);
   // makeApiCall();
    return false;
}
