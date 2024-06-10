<?php
// file for ajax request to get sales figures per Store for a time frame. Needs input view, mode and depending on selected view the input year/month/week
// Verify input
include './includes/checkInput.php';
// Start Connection
include '../conf/connectDB.php';

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}


// set the selected field depending on the view
// Prepare and execute SQL query
$sql = "SELECT o.storeID,";
$sql .= " YEAR(o.orderDate) as sellingYear, MONTH(o.orderDate) as sellingMonth,";

// set the mode
if ($mode === 'units') {
    $sql .= "SUM(o.nItems) as unitsSold";
} else {
    $sql .= "SUM(o.total) as revenue";
}

$sql .= " FROM orders o";


$sql .=  " GROUP BY o.storeID";
$sql .=  " , sellingYear, sellingMonth";
$sql .= " ORDER BY o.storeID, sellingYear, sellingMonth";

// Perform 
$result = $conn->query($sql);
// Close connection
$conn->close();
//make query and return result
$data = [];

foreach ($result as $row) {
    $columns = array_values($row); // Get the row values as an array
    $storeID = $columns[0];        // First column is storeID
    $x = (int)$columns[1] * 100 + (int)$columns[2]; // Combining second and third columns to form x
    $y = (int)$columns[3];         // Fourth column is y

    if (!isset($data[$storeID])) {
        $data[$storeID] = [
            'storeID' => $storeID,
            'data' => []
        ];
    }

    $data[$storeID]['data'][] = ['x' => $x, 'y' => $y];
}

// Re-index the array to match the desired output format
$output = array_values($data);

// Convert to JSON and send response
header('Content-Type: application/json');
//esecho json_encode($output, JSON_PRETTY_PRINT);
echo json_encode(['success' => true, 'data' => $output]);
