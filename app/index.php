<?php
// File to set up connection to the Database
include 'conf/connectDB.php';


// Open .html files that you want to display on homepage http://localhost:8080/ 
// include 'Frontend/managment_graph.html';
// include 'Frontend/storeInfo.html';

include 'ajaxExample.html';

// To test a single function .php file and display the table it returns. Choose here what .php file to test. It needs to return json data 
// $pathToPhpFile = "Backend/phpQueries/pizzaHeatMap.php"; 
// include 'Backend/phpQueries/testPhpFile.html';              // .html file to show a button that only activate the previous .php file upon clicking it and display the resulting table



// // Add any .php file of which you want to use a function of directly in index.php for testing purpose. Will be deleted at end 
// include 'Backend/phpQueries/pizzaSoldViews.php';

// $result = getSalesFromWeek(2020,2,'units');         // Select the function you want to test
//include 'Backend/phpQueries/displayJsonTable.html'          // .html file to display any json result as Table with this file

?>

