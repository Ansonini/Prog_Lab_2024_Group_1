<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing storeID']);
    exit;
}

$sql = "
    SELECT 
        c.customerID,
        COUNT(o.orderID) AS orderCount,
        MAX(o.orderDate) AS lastOrderDate,
        (
            SELECT p.SKU
            FROM orderItems oi
            JOIN products p ON oi.SKU = p.SKU
            WHERE oi.orderID IN (
                SELECT o2.orderID
                FROM orders o2
                WHERE o2.customerID = c.customerID
                  AND o2.storeID = o.storeID
            )
            GROUP BY p.SKU
            ORDER BY COUNT(p.SKU) DESC
            LIMIT 1
        ) AS mostOrderedProduct
    FROM 
        customers c
    JOIN 
        orders o ON c.customerID = o.customerID
    WHERE 
        o.storeID = '$storeID'
    GROUP BY 
        c.customerID
";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
