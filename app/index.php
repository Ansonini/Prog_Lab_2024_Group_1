<?php

include 'Backend/phpQueries/pizzaSoldViews.php';
include 'Backend/connectDB.php';

// Open some .html files
$htmlcontent = file_get_contents('Frontend/managment_graph.html');
echo $htmlcontent;

$htmlcontent2 = file_get_contents('Frontend/storeInfo.html');
echo $htmlcontent2;


// Choose here what .php file to test. It needs to return json data 
$pathToPhpFile = "Backend/phpQueries/pizzaHeatMap.php"; 
include 'Backend/phpQueries/testPhpFile.html';


$result = getSalesFromWeek(2020,1,'units');

// Save the result in a variable
$data = json_decode($result, true);

// Do something with $data

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pizza Sales Data</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

<h1>Pizza Sales Data</h1>

<table>
    <tr>
        <?php
        // Generate table headers dynamically based on the first row of data
        if (!empty($data) && is_array($data)) {
            $firstRow = $data[0];
            foreach ($firstRow as $key => $value) {
                echo "<th>" . htmlspecialchars($key) . "</th>";
            }
        } else {
            echo "<th>No data available</th>";
        }
        ?>
    </tr>
    <?php
    if (!empty($data) && is_array($data)) {
        foreach ($data as $row) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='" . (count($firstRow) ?? 1) . "'>No results found</td></tr>";
    }
    ?>
</table>

</body>
</html>
