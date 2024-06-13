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



// Create single or multi line chart out of any 2 layer json datasets
function createChart(data, chartID, chartType) {
    var canvas = document.getElementById(chartID);
    var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
    var chartInstance = Chart.getChart(ctx);

    // Check if the chart instance exists and destroy it if it does
    if (chartInstance) {
        chartInstance.destroy();
    }
    var labels, datasets;
    if ("data" in data[0]) {
        var multipleDataset = true;
        // Multiple datasets present

        // get the label of the dataset and of the values inside of the datasets for the labels of the axis
        var datasetLabel = Object.keys(data[0])[0];
        var keys = Object.keys(data[0].data[0]);
        var xLabel = keys[0];
        var yLabel = keys[1];
        console.log('Several dataset in data with', datasetLabel, "as identifier and values", xLabel, "and", yLabel);

        // Extract all unique x values for the x axis scale 
        var allXValues = new Set();
        data.forEach(store => {
            store.data.forEach(point => {
                allXValues.add(point[xLabel]);
            });
        });
        labels = Array.from(allXValues).sort();

        // Create datasets
        datasets = data.map(store => {
            return {
                label: store[datasetLabel],
                data: labels.map(x => {
                    var point = store.data.find(p => p[xLabel] === x);
                    return {
                        x: x,
                        y: point ? point[yLabel] : null // Use null for missing data points
                    };
                }),
                fill: false,
                backgroundColor: getColor(store[datasetLabel], 'background', multipleDataset),
                borderColor: getColor(store[datasetLabel], 'border', multipleDataset),
                borderWidth: 1
            };
        });

    } else {

        var multipleDataset = false;

        // On dataset present
        // Get the label for the two axis
        var keys = Object.keys(data[0]);
        var xLabel = keys[0];
        var yLabel = keys[1];
        
        console.log("found one dataset with", xLabel, 'and', yLabel);

        labels = data.map(item => item[xLabel]);
        datasets = [{
            label: 'Dataset',
            data: data.map(item => item[yLabel]),
            fill: false,
            backgroundColor: data.map(item => getColor(item[xLabel], 'background', multipleDataset, chartType)),
            borderColor: data.map(item => getColor(item[xLabel], 'border', multipleDataset, chartType)),
            borderWidth: 1
        }];
    }


    // Create the chart
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: xLabel
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabel
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



// Function to map dataset labels to colors from a predefined palette and apply opacity 
function getColor(datasetLabel, opacity, multipleDataset, chartType = 'default') {
    // Define a color palette with colors corresponding to each dataset label

    // default Color for if the x axis isn't a storeID, without opacity
    var defaultColor = 'rgba(75, 192, 192, '

    // if the chart is a line chart, option to chose the default color (will be set below)
    if (chartType === 'line' && multipleDataset == false) {
        return 'rgba(75, 192, 192, 1)';
    }

    // map of color for each store without opacity (will be set below)
    const colorPalette = {
        'S013343': 'rgba(255, 99, 132, ',
        'S048150': 'rgba(54, 162, 235, ',
        'S058118': 'rgba(255, 206, 86, ',
        'S062214': 'rgba(75, 192, 192, ',
        'S064089': 'rgba(153, 102, 255, ',
        'S068548': 'rgba(255, 159, 64, ',
        'S080157': 'rgba(255, 99, 132, ',
        'S122017': 'rgba(54, 162, 235, ',
        'S147185': 'rgba(255, 206, 86, ',
        'S216043': 'rgba(75, 192, 192, ',
        'S263879': 'rgba(153, 102, 255, ',
        'S276746': 'rgba(255, 159, 64, ',
        'S302800': 'rgba(255, 99, 132, ',
        'S351225': 'rgba(54, 162, 235, ',
        'S361257': 'rgba(255, 206, 86, ',
        'S370494': 'rgba(75, 192, 192, ',
        'S396799': 'rgba(153, 102, 255, ',
        'S449313': 'rgba(255, 159, 64, ',
        'S476770': 'rgba(255, 99, 132, ',
        'S486166': 'rgba(54, 162, 235, ',
        'S490972': 'rgba(255, 206, 86, ',
        'S505400': 'rgba(75, 192, 192, ',
        'S588444': 'rgba(153, 102, 255, ',
        'S606312': 'rgba(255, 159, 64, ',
        'S669665': 'rgba(255, 99, 132, ',
        'S688745': 'rgba(54, 162, 235, ',
        'S750231': 'rgba(255, 206, 86, ',
        'S799887': 'rgba(75, 192, 192, ',
        'S817950': 'rgba(153, 102, 255, ',
        'S872983': 'rgba(255, 159, 64, ',
        'S918734': 'rgba(255, 99, 132, ',
        'S948821': 'rgba(54, 162, 235, ',
    };

    // Get the base color from the palette
    let baseColor = colorPalette[datasetLabel] || defaultColor; // Default color if label not found

    baseColor= darkenColor(baseColor, 40);
    // Set opacity if the if it is for the border color
    if (opacity === 'border') {
        baseColor = baseColor + '1)';

    } else {
        if (chartType == 'line') {
            baseColor = baseColor + '1)';
        } else {
            baseColor = baseColor + '0.3)';
        }
    }

    return baseColor;
}


// Create simple bar chart out of 2 column json data
function createBarChart(data, chartID) {

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

    if ("data" in data[0]) {
        console.log('Several dataset in data');
    } else {
        console.log("only 1 data set found");
    }

    var keys = Object.keys(data[0]);
    var xLabel = keys[0];
    var yLabel = keys[1];

    // Process data to extract labels and values based on passed field names
    const labels = data.map(item => item[xLabel]);
    const values = data.map(item => item[yLabel]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, ',
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



// Helper function to generate random colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Function to darken a given RGBA color
function darkenColor(rgbaColor, amount) {
    // Extract the RGBA components
    const rgba = rgbaColor.match(/\d+/g).map(Number);
    const r = Math.max(rgba[0] - amount, 0);
    const g = Math.max(rgba[1] - amount, 0);
    const b = Math.max(rgba[2] - amount, 0);
    return `rgba(${r}, ${g}, ${b}, `;
}
