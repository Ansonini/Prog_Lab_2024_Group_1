<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';

if (isset($_POST['storeSelection'])) {
    $storeSelection = $_POST['storeSelection'];
    $storeFilter = " WHERE o.storeID = \"$storeSelection\"";
} else {
    
    $storeFilter = '';
}


$sql = "SELECT * from stores $storeFilter ";


//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
