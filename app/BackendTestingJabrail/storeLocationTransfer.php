<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); 

include '/var/www/html/ajax/includes/checkInput.php';


include '/var/www/html/ajax/includes/connectDB.php';


$sql = "SELECT storeID, zipcode, state_abbr, latitude, longitude, city, state, distance FROM stores";


include '/var/www/html/ajax/includes/makeQuery.php';
?>