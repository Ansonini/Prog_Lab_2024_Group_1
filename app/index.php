<?php

include 'Backend/phpQueries/pizzaSoldViews.php';
include 'Backend/connectDB.php';

// Open some .html files
include 'Frontend/managment_graph.html';


include 'Frontend/storeInfo.html';


// Choose here what .php file to test. It needs to return json data 
$pathToPhpFile = "Backend/phpQueries/pizzaHeatMap.php"; 
include 'Backend/phpQueries/testPhpFile.html';


$result = getSalesFromWeek(2020,2,'units');

// Save the result in a variable
$data = json_decode($result, true);

include 'Backend/phpQueries/displayJsonTable.html'

?>

