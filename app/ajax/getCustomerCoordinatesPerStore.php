<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';



$sql = "SELECT c.customerID, c.latitude
FROM customers c
ORDER BY c.customerID";


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
