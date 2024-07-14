<?php
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing storeID']);
    exit;
}

$sql = "SELECT DISTINCT o.customerID
        FROM orders o
        WHERE o.storeID = '$storeID'
        ORDER BY o.customerID";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQuery.php';
?>
