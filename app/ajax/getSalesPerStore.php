<?php

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

// set the mode
if ($mode === 'units') {
    $sql .= "SUM(o.nItems) as unitsSold";
} else {
    $sql .= "SUM(o.total) as revenue";
}

$sql .= " FROM orders o";

// set the where and group statement depending on the view
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

$sql .=  " GROUP BY o.storeID";

if ($mode === 'units') {
    $sql .= " ORDER BY unitsSold desc";
} else {
    $sql .= " ORDER BY revenue desc";
}

$result = $conn->query($sql);

if ($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $data]);
} else {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
}

// Close connection
$conn->close();
