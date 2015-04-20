<?php
$con=mysqli_connect("naijaevents.db.9059557.hostedresource.com","naijaevents","naijaEvent1!","naijaevents");
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Create table
$sql="CREATE TABLE Schedule1(PID INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(PID),message CHAR(160),notify_time CHAR(30),phone INT)";

// Execute query
if (mysqli_query($con,$sql)) {
  echo "Table persons created successfully";
} else {
  echo "Error creating table: " . mysqli_error($con);
}
?>