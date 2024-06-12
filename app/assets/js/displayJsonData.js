// Display any Json table that has 1 layer
function displayJsonTable(data, tableContainerId) {
    if (!data || data.length === 0) {
        document.getElementById(tableContainerId).innerHTML = '<p>No data available</p>';
        return;
    }

    let tableHtml = '<table>';
    tableHtml += '<tr>';

    // Generate table headers based on keys of the first row
    const headers = Object.keys(data[0]);
    headers.forEach(key => {
        tableHtml += '<th>' + key + '</th>';
    });
    tableHtml += '</tr>';

    // Generate table rows
    data.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach(key => {
            tableHtml += '<td>' + row[key] + '</td>';
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</table>';

    document.getElementById(tableContainerId).innerHTML = tableHtml;
}


// Create simple bar chart out of 2 column json data
function createBarChart(data, chartID) {
    var keys = Object.keys(data[0]);
    var labelField = keys[0];
    var valueField = keys[1];

    var canvas = document.getElementById(chartID);
    // Get the context of the canvas element
    var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
    var chartInstance = Chart.getChart(ctx);

    // Check if the chart instance exists
    if (chartInstance) {
        // Destroy the chart instance
        chartInstance.destroy();
    }




    // Process data to extract labels and values based on passed field names
    const labels = data.map(item => item[labelField]);
    const values = data.map(item => item[valueField]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Create single or multi line chart out of any 2 layer json datasets
function createLineChart(data, chartID) {
    var canvas = document.getElementById(chartID);
    var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
    var chartInstance = Chart.getChart(ctx);

    // Check if the chart instance exists and destroy it if it does
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Extract all unique x values
    var allXValues = new Set();
    data.forEach(store => {
        store.data.forEach(point => {
            allXValues.add(point.x);
        });
    });
    var labels = Array.from(allXValues).sort();

    // Create datasets
    var datasets = data.map(store => {
        return {
            label: store.storeID,
            data: labels.map(x => {
                var point = store.data.find(p => p.x === x);
                return {
                    x: x,
                    y: point ? point.y : null // Use null for missing data points
                };
            }),
            fill: false,
            borderColor: getRandomColor(), // Optional: Set a random color for each dataset
        };
    });

    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Use the extracted labels
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'category', // Use 'category' for string x-axis
                    title: {
                        display: true,
                        text: 'X Axis'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Y Axis'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

// Helper function to generate random colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
