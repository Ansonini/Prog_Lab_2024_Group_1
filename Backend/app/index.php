<?php
$servername = "mysql"; // This should match the service name in your docker-compose.yml
$username = "root";
$password = "1234";
$dbname = "pizza";
$port = 3306;


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT sku, pizzaName, price FROM products";
$result = $conn->query($sql);


if ($result->num_rows > 0) {
    // Output data of each row
    echo "<table border='1'>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
            </tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["sku"]. "</td>
                <td>" . $row["pizzaName"]. "</td>
                <td>" . $row["price"]. "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}

$conn->close();
?>