<?php
header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';
include '/var/www/html/ajax/includes/checkInput.php';

$sql = "";

if ($mode === 'revenue') {
    $sql .= "SELECT sub.pizzaName, sum(sub.revenuePerPizza) as revenue
    FROM (";
};

$sql .= "SELECT p.pizzaName,
            COUNT(oi.SKU) as unitsSold ";
            
if ($mode === 'revenue') {
    $sql .= ", p.pizzaSize, p.Price,
            p.Price * COUNT(oi.SKU) as revenuePerPizza";
}

$sql .= " FROM products p 
        JOIN orderItems oi ON oi.SKU = p.SKU 
        JOIN orders o ON o.orderID = oi.orderID "; 

switch ($view) {
    case 'completeView':
        break;
    case 'yearView':
        $sql .= " WHERE YEAR(o.orderDate) = $year";
        break;
    case 'monthView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month";
        break;
    case 'weekView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week";
        break;
}

$sql .= " GROUP BY p.pizzaName";

if ($mode === 'revenue') {
    $sql .= ", p.pizzaSize, p.Price";
};

if ($mode === 'revenue') {
    $sql .= ") as sub GROUP BY pizzaName";
}; 



//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';