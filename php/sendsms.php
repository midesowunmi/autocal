<?php
// Get the PHP helper library from twilio.com/docs/php/install
require_once('twilio-php/Services/Twilio.php'); // Loads the library

$con=mysqli_connect("naijaevents.db.9059557.hostedresource.com","naijaevents","naijaEvent1!","naijaevents");
// Check database connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$result = mysqli_query($con,"SELECT * FROM Schedule1");

//create the calendar event object
class CalEvent{
 var $message;
 var $phone;
 var $eventtime;

 function set_message ($my_message){
  $this->message = $my_message;
 }

 function set_phone ($my_phone){
   $this->phone = '+' .$my_phone;
  }

  function set_time ($my_time){
    $this->eventtime = $my_time;
   }

}

//create event object array
$event_array = array();

while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
$event_obj = new CalEvent;

$event_obj->set_message($row['message']);

$event_obj->set_phone($row['phone']);

$event_obj->set_time($row['notify_time']);

// add event objects to array
array_push($event_array, $event_obj);

}

mysqli_close($con);
date_default_timezone_set("Africa/Lagos");
$date = new DateTime();
$mydate = $date->format('Y-m-d H:i');

foreach ($event_array as $my_event){
  if($my_event->eventtime == $mydate){
     // Your Account Sid and Auth Token from twilio.com/user/account
     $sid = "AC9a0f09ecdbcb532036a8b9ca1c617cb2";
     $token = "4f62fca6f269805b07a8cb9ca1d35e88";
     $client = new Services_Twilio($sid, $token);
     $mssg = $my_event->message; //$_POST[textMessage];
     $phonenbr = $my_event->phone;
     $client->account->messages->sendMessage("+14043416353", $phonenbr, $mssg);
   // echo $my_event->eventtime;
  }
}

//echo "SMS sent...";

//$date = new DateTime();
//$mydate = $date->format('Y-m-d H:i:s');
echo $mydate;
?>
