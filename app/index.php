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

// Open some .html files
$htmlcontent = file_get_contents('Frontend/managment_graph.html');
echo $htmlcontent;

$htmlcontent2 = file_get_contents('Frontend/storeInfo.html');
echo $htmlcontent2;

// Make some sql queries
$sql = "SELECT orderItemID, sku , orderID FROM orderItems where orderID=100";
$result = $conn->query($sql);

$sql2 = "SELECT p.pizzaName , p.pizzaSize , p.Price , COUNT(oi.SKU) as soldPizzas, p.Price * count(oi.SKU) as 'Revenue/pizza'
        FROM products p 
        JOIN orderItems oi on oi.SKU=p.SKU 
        JOIN orders o on o.orderID = oi.orderID 
        GROUP BY p.pizzaName, p.pizzaSize , p.Price
        ;";
$result2 = $conn->query($sql2);

// Display result from sql  
echo "<br>
    Items in Order number 100";

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


echo "<br>
    Revenue per pizza type and size";

if ($result2->num_rows > 0) {
    // Output data of each row
    echo "<table border='1'>
            <tr>
                <th>pizzaName</th>
                <th>pizzaSize</th>
                <th>Price</th>
                <th>soldPizzas</th>
                <th>Revenue/pizza</th>
            </tr>";
    while($row = $result2->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["pizzaName"]. "</td>
                <td>" . $row["pizzaSize"]. "</td>
                <td>" . $row["Price"]. "</td>
                <td>" . $row["soldPizzas"]. "</td>
                <td>" . $row["Revenue/pizza"]. "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}

$conn->close();
?>