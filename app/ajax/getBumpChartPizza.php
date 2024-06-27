<?php
// Get Top X rank pizza base on time and revenue or units sold
// Needs input view, mode and depending on selected view the input year/month/week
// can take a limit of ranked places (e.g. top 5), default if not set is 10

header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';


// Determine the time period and partition by clause
$measuredValue = ($mode === 'revenue') ? ' revenue ' : ' unitsSold ';
//
$rankByCalc = ($mode === 'revenue') ? ' SUM(salesPerSKU*p.price) ' : ' SUM(salesPerSKU) ';

switch ($view) {
    case 'completeView':
        $timePeriod = 'YEAR(o.orderDate) as sellingYear';
        $partitionBy = 'YEAR(o.orderDate)';
        $groupBy = 'sellingYear';
        $rankingFrame = 'yearlyRank';
        break;
    case 'yearView':
        $timePeriod = "DATE_FORMAT(o.orderDate, '%Y-%m') as sellingMonth";
        $partitionBy = "DATE_FORMAT(o.orderDate, '%Y-%m')";
        $groupBy = 'sellingMonth';
        $rankingFrame = 'monthlyRank';
        break;
    case 'monthView':
    case 'weekView':
        $timePeriod = 'DATE(o.orderDate) as sellingDay';
        $partitionBy = 'DATE(o.orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        break;
}

// Set the WHERE clause and GROUP BY statement based on the view
switch ($view) {
    case 'completeView':
        $timeFilter = '';
        break;
    case 'yearView':
        $timeFilter = " WHERE YEAR(o.orderDate) = $year ";
        break;
    case 'monthView':
        $timeFilter = " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month ";
        break;
    case 'weekView':
        $timeFilter = " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week ";
        break;
}

// Create query with subquery
$sql = "SELECT pizzaName,
                $groupBy,
                $rankingFrame
        FROM (SELECT p.pizzaName, 
                    $groupBy,
                    RANK() OVER (PARTITION BY $groupBy ORDER BY $rankByCalc  DESC) AS $rankingFrame
                FROM (SELECT oi.sku, $timePeriod, COUNT(oi.sku) as salesPerSKU
                        FROM orders o JOIN orderItems oi ON o.orderID = oi.orderID
                        $timeFilter
                        GROUP BY oi.sku, $groupBy) as subsub JOIN products p on p.sku = subsub.sku
                GROUP BY p.pizzaName, $groupBy) as sub 
        WHERE $rankingFrame <= $rankingSize
        ORDER BY $groupBy, $rankingFrame";



// For Debugging the sql query
// echo $sql;

$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
