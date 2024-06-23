<?php
header('Content-Type: application/json');


// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

// Verify input
include '/var/www/html/ajax/includes/checkInput.php';

$sql = "SELECT p.pizzaName, sub.sellingMonth";

if ($mode === 'units') {
        $sql .= ", sum(sub.soldPizzas) as unitsSold ";
} elseif ($mode === 'revenue') {
        $sql .= ", sum(sub.soldPizzas*p.price) as revenue";
}


$sql .= " FROM (SELECT
                oi.sku,
                DATE_FORMAT(o.orderDate, '%Y-%m') as sellingMonth,
                COUNT(oi.SKU) as soldPizzas
                FROM orderItems oi
                        JOIN orders o ON o.orderID = oi.orderID
                GROUP BY oi.sku, sellingMonth) as sub
        JOIN products p on p.sku=sub.sku
        GROUP BY p.pizzaName , sellingMonth
        ORDER BY p.pizzaName, sellingMonth";

// if query has mutliple dataset with first column as identifier and second and third as data
$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
