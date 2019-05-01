# OEETECT
#Update 28/04/2019

Events that hinder production in the manufacturing field can be entered into a database.

Web Application is hosted on a nodejs server and is displayed on localhost:8000

The data base is a noSQL database call Mongodb.

All events entered must have the startdate and time and finishdate and time. From entering these, the duration of the event is automatically calculated. All data is then stored in collectionns and be viewed using Robo3T.

Aggregations are then calulated using the Mongodb Pipeline using a CursortoArray function.


Aggregation results are now stored in a collection called results.

Collection is then called and is displayed on webpage where aggregation results are displayed on a bar graph using Chart.js.

Website is now styled correctly and user friendly.

Login ans Sign up are working correctly. Login in or signup must be made via email and a password which must be more than 4 characters long.

Passwords are also salted and Bycrpted.

User Authentication added so user must loginin before entering and retrieving data. 

Project Functionality Completed.

Project Completed.

REFERENCES

Nodejs 
https://nodejs.org/en/

MongoDb
https://www.mongodb.com/

Robo3t
https://robomongo.org/

Npm
https://www.npmjs.com/

