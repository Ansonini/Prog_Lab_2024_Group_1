<?php
$servername = "mysql"; // This should match the service name in your docker-compose.yml
$username = "root";
$password = "1234";
$dbname = "pizzaDB";
$port = 3306;


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT orderItemID, sku , orderID FROM orderItems where orderID=100";
$result = $conn->query($sql);

$htmlcontent = file_get_contents(./Frontend/managment_graph.html)
echo $htmlcontent

if ($result->num_rows > 0) {
    // Output data of each row
    echo "<table border='1'>
            <tr>
                <th>orderItemID</th>
                <th>sku</th>
                <th>orderID</th>
            </tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["orderItemID"]. "</td>
                <td>" . $row["sku"]. "</td>
                <td>" . $row["orderID"]. "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}

$conn->close();
?>