<?php
// Включение отображения ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Убедитесь, что тип контента установлен в JSON

// Подключение к базе данных
include __DIR__ . '/../connectDB.php';

// SQL-запрос для получения данных о местоположении магазинов
$sql = "SELECT storeID, zipcode, state_abbr, latitude, longitude, city, state, distance FROM stores";

// Выполнение запроса
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    // Получение результатов запроса
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    $data[] = ["message" => "0 results"];
}

// Закрытие соединения с базой данных
$conn->close();

// Возврат данных в формате JSON
echo json_encode($data);
?>
