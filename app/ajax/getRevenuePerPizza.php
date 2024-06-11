<?php

header('Content-Type: application/json');


// include the DB connect file. ../ because its outside of this folder
include '/var/www/html/ajax/includes/connectDB.php';

$sql = "SELECT 
            p.pizzaName, 
            p.pizzaSize,
            p.Price, 
            COUNT(oi.SKU) as soldPizzas, 
            p.Price * COUNT(oi.SKU) as RevenuePerPizza
        FROM products p 
        JOIN orderItems oi ON oi.SKU = p.SKU 
        JOIN orders o ON o.orderID = oi.orderID 
        GROUP BY p.pizzaName, p.pizzaSize, p.Price";


//make query and return result
include '/var/www/html/ajax/includes/makeAndVerifyQuery.php';
