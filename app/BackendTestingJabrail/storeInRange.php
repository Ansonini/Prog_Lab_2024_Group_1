<?php
// Проверка входных данных
include '/var/www/html/ajax/includes/checkInput.php';
// Подключение к базе данных
include '/var/www/html/ajax/includes/connectDB.php';

// Проверка соединения
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Получение координат из POST-запроса
$minLatitude = isset($_POST['minLatitude']) ? (float)$_POST['minLatitude'] : null;
$maxLatitude = isset($_POST['maxLatitude']) ? (float)$_POST['maxLatitude'] : null;
$minLongitude = isset($_POST['minLongitude']) ? (float)$_POST['minLongitude'] : null;
$maxLongitude = isset($_POST['maxLongitude']) ? (float)$_POST['maxLongitude'] : null;

if ($minLatitude === null || $maxLatitude === null || $minLongitude === null || $maxLongitude === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid coordinates provided.']);
    exit;
}
$time_intervals = [
    'Morning' => ['06:00:00', '11:59:59'],
    'Lunch' => ['12:00:00', '15:59:59'],
    'Evening' => ['16:00:00', '21:59:59'],
    'Night' => ['22:00:00', '05:59:59']
];

$data = [];

// Prepare SQL queries for each time interval
foreach ($time_intervals as $label => $interval) {
    $start_time = $interval[0];
    $end_time = $interval[1];

    $sql = "
        SELECT \"$label\" AS interval, COUNT(oi.SKU) AS totalPizzas
        FROM orders o
        JOIN orderItems oi ON o.orderID = oi.orderID
        WHERE TIME(o.orderDate) BETWEEN '$start_time' AND '$end_time'
    ";

    if ($year != 'alltime') {
        $sql .= " AND YEAR(o.orderDate) = $year";
    }

    if ($month != 'alltime') {
        $sql .= " AND MONTH(o.orderDate) = $month";
    }

    if ($week != 'alltime') {
        $sql .= " AND WEEK(o.orderDate, 1) = $week";
    }

    if ($mode == 'average') {
        $sql = "
            SELECT '$label' AS interval, AVG(totalPizzas) AS totalPizzas FROM ($sql) AS subquery
        ";
    }

    $data[] = $sql;
}

// Подготовка SQL-запроса
$sql = "SELECT COUNT(*) as store_count FROM stores WHERE latitude BETWEEN $minLatitude AND $maxLatitude AND longitude BETWEEN $minLongitude AND $maxLongitude";

// Выполнение запроса и возврат результата
include '/var/www/html/ajax/includes/makeQuery.php';
?>
