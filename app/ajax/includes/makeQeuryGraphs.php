<?php
// Perform query
$result = $conn->query($sql);
// Close connection
$conn->close();

if ($result) {
    $data = [];

    if (isset($multipleDataset)) {
        $fields = $result->fetch_fields();
        $setLabel = $fields[0]->name; // Identifier of one dataset
        $xLabel = $fields[1]->name;     // X-axis label
        $yLabel = $fields[2]->name;     // Y-axis label

        foreach ($result as $row) {
            $storeID = $row[$setLabel];
            if (!isset($data[$storeID])) {
                $data[$storeID] = [
                    'storeID' => $storeID,
                    'data' => []
                ];
            }
            $data[$storeID]['data'][] = [
                $xLabel => $row[$xLabel],
                $yLabel => $row[$yLabel]
            ];
        }

        // Re-index the array to match the desired output format
        $output = array_values($data);

        // Convert to JSON and send response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'data' => $output]);
    } else {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
}
?>
