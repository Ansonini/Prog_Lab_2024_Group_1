<?php
header('Content-Type: application/json');


// Check if parameters are set
if (isset($_POST['mode'], $_POST['year'], $_POST['week'])) {

    include '../conf/connectDB.php';
    // Sanitize input
    $mode = $_POST['mode'] === 'units' ? 'units' : 'revenue';
    $year = intval($_POST['year']);
    $week = intval($_POST['week']);

    // Validate input
    if ($year <= 0 || $week <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid year or week']);
        exit;
    }

    // Check connection
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }


    // Prepare and execute SQL query
    $sql = "SELECT o.storeID,";

    if ($mode === 'units') {
        $sql .= "SUM(o.nItems) as unitsSold";
    } else {
        $sql .= "SUM(o.total) as revenue";
    }

    $sql .=  " FROM orders o
            WHERE YEAR(o.orderDate) = $year
            AND WEEK(o.orderDate, 1) = $week
            GROUP BY o.storeID";

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
} else {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
}
