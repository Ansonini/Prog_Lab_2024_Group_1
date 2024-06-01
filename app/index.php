<?php

// Open some .html files
$htmlcontent = file_get_contents('Frontend/managment_graph.html');
echo $htmlcontent;

$htmlcontent2 = file_get_contents('Frontend/storeInfo.html');
echo $htmlcontent2;


// Choose here what .php file to test. It needs to return json data 
$pathToPhpFile = "Backend/phpQueries/pizzaHeatMap.php"; 
include 'Backend/phpQueries/testPhpFile.html';

?>
