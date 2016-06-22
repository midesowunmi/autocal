<?php
$con=mysqli_connect("naijaevents.db.9059557.hostedresource.com","naijaevents","naijaEvent1!","naijaevents");
// Check database connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// escape variables for security
$message = mysqli_real_escape_string($con, $_POST['smsMessage']);
$phone = mysqli_real_escape_string($con, $_POST['cellPhone']);
$event_date = mysqli_real_escape_string($con, $_POST['eventDate']);

$phonelength = strlen($phone);
if($phonelength > 11){
     $phone = '+'.$phone;
}
$sql="INSERT INTO Schedule1 (message, phone, notify_time)
VALUES ('$message', '$phone', '$event_date')";

if (!mysqli_query($con,$sql)) {
  echo 'Error: ' . mysqli_error($con);
  die('Error: ' . mysqli_error($con));

}
else{
  echo "1 event added";
}


mysqli_close($con);
?>
