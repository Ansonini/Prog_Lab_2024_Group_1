<?php
// file for ajax request to get sales figures for a time frame. Needs input view, mode, year, and viewIndex
// Verify input
include './includes/checkInput.php';
// Start Connection
include '../conf/connectDB.php';

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare and execute SQL query
// set the selected field depending on the view
$sql = "SELECT YEAR(o.orderDate) as sellingYear";

switch ($view) {
    case 'completeView':
        $sql = "SELECT YEAR(o.orderDate) as sellingYear";
        break;
    case 'yearView':
        $sql = "SELECT MONTH(o.orderDate) as sellingMonth";
        break;
    case 'monthView':
        $sql = "SELECT WEEK(o.orderDate, 1) as sellingWeek";
        break;
    case 'weekView':
        $sql = "SELECT DAYNAME(o.orderDate) as sellingDay";
        break;
}

// set the mode 
if ($mode === 'units') {
    $sql .= ", SUM(o.nItems) as unitsSold";
} else {
    $sql .= ", SUM(o.total) as revenue";
}

$sql .= " FROM orders o";

// set the where and group statement depending on the view
switch ($view) {
    case 'completeView':
        $sql .= " GROUP BY sellingYear ORDER BY sellingYear";
        break;
    case 'yearView':
        $sql .= " WHERE YEAR(o.orderDate) = $year
                GROUP BY sellingMonth
                ORDER BY sellingMonth";
        break;
    case 'monthView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND MONTH(o.orderDate) = $month
                GROUP BY sellingWeek
                ORDER BY sellingWeek";
        break;
    case 'weekView':
        $sql .= " WHERE YEAR(o.orderDate) = $year AND WEEK(o.orderDate, 1) = $week
                GROUP BY WEEKDAY(o.orderDate), sellingDay
                ORDER BY WEEKDAY(o.orderDate)";
        break;
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
