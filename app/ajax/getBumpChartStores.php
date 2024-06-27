<?php
// Get Top X rank Store base on time and revenue or units sold
// Needs input view, mode and depending on selected view the input year/month/week
// can take a limit of ranked places (e.g. top 5), default if not set is 10

header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';


// Determine the time period and partition by clause

switch ($view) {
    case 'completeView':
        $timePeriod = 'YEAR(orderDate) as sellingYear';
        $partitionBy = 'YEAR(orderDate)';
        $groupBy = 'sellingYear';
        $rankingFrame = 'yearlyRank';
        break;
    case 'yearView':
        $timePeriod = "DATE_FORMAT(orderDate, '%Y-%m') as sellingMonth";
        $partitionBy = "DATE_FORMAT(orderDate, '%Y-%m')";
        $groupBy = 'sellingMonth';
        $rankingFrame = 'monthlyRank';
        break;
    case 'monthView':
    case 'weekView':
        $timePeriod = 'DATE(orderDate) as sellingDay';
        $partitionBy = 'DATE(orderDate)';
        $groupBy = 'sellingDay';
        $rankingFrame = 'dailyRank';
        break;
}

// Create query with subquery
$sql = "SELECT storeID, $groupBy, $rankingFrame
        FROM (SELECT storeID, ";


// Determine the order by clause based on the mode
$orderBy = ($mode === 'revenue') ? 'SUM(total)' : 'SUM(nItems)';

$sql .= "{$timePeriod}, RANK() OVER (PARTITION BY {$partitionBy} ORDER BY {$orderBy} DESC) AS $rankingFrame ";
$sql .= 'FROM orders ';

// Set the WHERE clause and GROUP BY statement based on the view
switch ($view) {
    case 'completeView':
        $sql .= "GROUP BY storeID, {$groupBy} ";
        break;
    case 'yearView':
        $sql .= "WHERE YEAR(orderDate) = $year GROUP BY storeID, {$groupBy} ";
        break;
    case 'monthView':
        $sql .= "WHERE YEAR(orderDate) = $year AND MONTH(orderDate) = $month GROUP BY storeID, {$groupBy} ";
        break;
    case 'weekView':
        $sql .= "WHERE YEAR(orderDate) = $year AND WEEK(orderDate, 1) = $week GROUP BY storeID, {$groupBy} ";
        break;
}

$sql .= "ORDER BY {$groupBy}, $rankingFrame ) as rankedSales
        WHERE $rankingFrame <= $rankingSize
        ORDER BY $groupBy,
                $rankingFrame";





// For Debugging the sql query
//echo $sql;

$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
