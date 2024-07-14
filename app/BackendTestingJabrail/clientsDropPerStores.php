<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Start Connection
include '/var/www/html/ajax/includes/connectDB.php';

$storeID = isset($_POST['storeID']) ? $_POST['storeID'] : null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing storeID']);
    exit;
}

// Debugging: Log storeID
error_log("Store ID: " . $storeID);

$sql = "SELECT DISTINCT o.customerID
        FROM orders o
        WHERE o.storeID = '$storeID'
        ORDER BY o.customerID";

$multipleDataset = true;

include '/var/www/html/ajax/includes/makeQueryExtra.php';
?>
