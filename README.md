# autocal
AutoCalendar SMS reminder

Chrome extension that allows Google Calendar users to create SMS reminders for important appointments on their schedules.
The application has two modes - onLine and offLine
onLine is available when the user is connected to the internet and then saves the new event directly to their Google calendar.
Also the reminder is saved to a mySQL database.

The offline mode is available as a Chrome Extension when the user is offline and not logged into their Google account.
New events are stored using local storage on the user's computer.
When the user goes online, he can sync the offline and online events. Offline evenst are then stored in the mySQL database and also added to the Google Calendar

Events can be created on the hour or half hour only. The Apache backend server has a cron job which runs every 30 minutes. The script checks the database for any event reminders
set for that time and sends an SMS using Twilio API
