<?php
// Включение отображения ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Убедитесь, что тип контента установлен в JSON

include '/var/www/html/ajax/includes/checkInput.php';

// Подключение к базе данных
include '/var/www/html/ajax/includes/connectDB.php';

// SQL-запрос для получения данных о местоположении магазинов
$sql = "SELECT storeID, zipcode, state_abbr, latitude, longitude, city, state, distance FROM stores";

//make query and return result
include '/var/www/html/ajax/includes/makeQuery.php';
?>