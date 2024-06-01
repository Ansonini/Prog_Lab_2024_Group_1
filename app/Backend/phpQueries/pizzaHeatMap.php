<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'path/to/error.log');
error_reporting(E_ALL);

// Enable output buffering
ob_start();

// include the DB connect file. ../ because its outside of this folder
include '../connectDB.php';

$sql = "SELECT
p.pizzaName as name1,
p2.pizzaName as name2
FROM
products p
JOIN orderItems oi on
oi.sku = p.sku
JOIN orderItems oi2 on
oi.orderID = oi2.orderID
JOIN products p2 on
oi2.sku = p2.sku
WHERE
oi.orderItemID != oi2.orderItemID 
AND oi.orderID <100000
order by
oi.orderID";

$result = $conn->query($sql);

// Pizza mapping
$pizzaMap = [
    "Margherita Pizza" => 0,
    "Pepperoni Pizza" => 1,
    "Hawaiian Pizza" => 2,
    "Meat Lover's Pizza" => 3,
    "Veggie Pizza" => 4,
    "BBQ Chicken Pizza" => 5,
    "Buffalo Chicken Pizza" => 6,
    "Sicilian Pizza" => 7,
    "Oxtail Pizza" => 8,
];

// Initialize 9x9 heatmap
$heatmap = array_fill(0, 9, array_fill(0, 9, 0));

// Process query result
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $pizza1 = $row['name1'];
        $pizza2 = $row['name2'];

        // Debugging output to verify pizzas
        error_log("Processing row: $pizza1, $pizza2");

        if (isset($pizzaMap[$pizza1]) && isset($pizzaMap[$pizza2])) {
            $x = $pizzaMap[$pizza1];
            $y = $pizzaMap[$pizza2];
            $heatmap[$x][$y]++;

            // Debugging output to verify increments
            error_log("Incrementing heatmap[$x][$y]: " . $heatmap[$x][$y]);
        } else {
            // Debugging output for unmapped pizzas
            error_log("Unmapped pizza(s): $pizza1, $pizza2");
        }
    }
} else {
    // End output buffering and clean buffer
    ob_end_clean();
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}

// Divide diagonal elements by 2
for ($i = 0; $i < 9; $i++) {
    $heatmap[$i][$i] /= 2;

    // Debugging output to verify division
    error_log("Dividing heatmap[$i][$i] by 2: " . $heatmap[$i][$i]);
}

$conn->close();

// End output buffering and clean buffer
ob_end_clean();

// Return heatmap as JSON
header('Content-Type: application/json');
echo json_encode($heatmap);
?>