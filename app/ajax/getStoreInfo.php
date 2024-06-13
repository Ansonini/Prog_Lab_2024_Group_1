<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = $_POST['storeID'];

$sql = "SELECT * from stores where storeID = \"$storeID\"";


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
