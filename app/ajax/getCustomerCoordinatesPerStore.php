<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';



$sql = "SELECT storeID, c.customerID, latitude, longitude, visites
        FROM (SELECT storeID, o.customerID, COUNT(o.customerID) as visites
            FROM orders o
            GROUP BY storeID, o.customerID) as sub
        JOIN customers c on sub.customerID = c.customerID";

$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
