<?php
/**
 * This section ensures that Twilio gets a response.
 */
header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<Response><Message>AutoCal message delivered</Message></Response>'; //Place the desired response (if any) here
 
/**
 * This section actually sends the email.
 */
$to      = "midesowunmi@yahoo.com"; // Your email address
$subject = "AutoCal message {$_REQUEST['From']} at {$_REQUEST['To']}";
$message = "You have received a message from {$_REQUEST['From']}.
Body: {$_REQUEST['Body']}";
$headers = "From: admin@naijametro.com"; // Who should it come from?
 
mail($to, $subject, $message, $headers);