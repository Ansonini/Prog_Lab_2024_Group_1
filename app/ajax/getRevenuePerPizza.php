<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';

$sql = "SELECT 
            p.pizzaName, 
            (YEAR(o.orderDate)*100 + MONTH(o.orderDate)) as sellingMonth,
            COUNT(oi.SKU) as soldPizzas
        FROM products p 
        JOIN orderItems oi ON oi.SKU = p.SKU 
        JOIN orders o ON o.orderID = oi.orderID 
        GROUP BY p.pizzaName, sellingMonth";

// if query has mutliple dataset with first column as identifier and second and third as data
$multipleDataset = true;

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
