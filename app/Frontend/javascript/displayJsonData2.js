// displayJson2.js

// Flatten a nested JSON file into a simple table
function flattenData(data) {
    let flattenedData = [];

    data.forEach(item => {
        // Identify the keys for parent data and nested data
        const keys = Object.keys(item);
        const nestedKey = keys.find(key => Array.isArray(item[key]));
        const parentKeys = keys.filter(key => key !== nestedKey);

        if (nestedKey) {
            const parentValues = parentKeys.reduce((obj, key) => {
                obj[key] = item[key];
                return obj;
            }, {});

            item[nestedKey].forEach(childItem => {
                let flattenedItem = { ...parentValues, ...childItem };
                flattenedData.push(flattenedItem);
            });
        } else {
            flattenedData.push(item);
        }
    });

    return flattenedData;
}

// Display any JSON table
function displayJsonTable(data, tableContainerId) {
    if (!data || data.length === 0) {
        document.getElementById(tableContainerId).innerHTML = '<p>No data available</p>';
        return;
    }

    // Flatten the data
    let flattenedData = flattenData(data);

    let tableHtml = '<table>';
    tableHtml += '<tr>';

    // Generate table headers based on keys of the first row of flattened data
    const headers = Object.keys(flattenedData[0]);
    headers.forEach(key => {
        tableHtml += '<th>' + key + '</th>';
    });
    tableHtml += '</tr>';

    // Generate table rows
    flattenedData.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach(key => {
            tableHtml += '<td>' + row[key] + '</td>';
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</table>';

    document.getElementById(tableContainerId).innerHTML = tableHtml;
}

function createChart(data, chartID, chartType, xLabelOverride, yLabelOverride) {
    if (!data || data.length === 0) {
        console.error('No data available for chart:', chartID);
        document.getElementById(chartID).innerHTML = '<p>No data available</p>';
        return;
    }

    var canvas = document.getElementById(chartID);
    var ctx = canvas.getContext('2d');

    var chartInstance = Chart.getChart(ctx);
    if (chartInstance) {
        chartInstance.destroy();
    }

    var labels = [];
    var datasets = [];
    var multipleDataset = false;
    var displayLegend = false;

    if (xLabelOverride === 'period' && yLabelOverride === 'totalPizzas') {
        // Для yearView, monthView и weekView
        if (data[0].data.length > 1) {
            labels = data[0].data.map(item => item[xLabelOverride]);
            datasets = data.map(store => {
                return {
                    label: store.storeID,
                    data: store.data.map(point => point[yLabelOverride]),
                    fill: false,
                    backgroundColor: getColor(store.storeID, 'background', true),
                    borderColor: getColor(store.storeID, 'border', true),
                    borderWidth: 1
                };
            });
            multipleDataset = true;
            displayLegend = true;
        } else if (data[0].data.length === 1 && Object.keys(data[0].data[0]).length > 2) {
            // Для dayView
            labels = ['Morning', 'Lunch', 'Evening', 'Night'];
            datasets = data.map(store => {
                return {
                    label: store.storeID,
                    data: [
                        store.data[0].Morning,
                        store.data[0].Lunch,
                        store.data[0].Evening,
                        store.data[0].Night
                    ],
                    fill: false,
                    backgroundColor: getColor(store.storeID, 'background', true),
                    borderColor: getColor(store.storeID, 'border', true),
                    borderWidth: 1
                };
            });
            multipleDataset = true;
            displayLegend = true;
        }
    } else if (xLabelOverride === 'period' && yLabelOverride === 'revenue') {
        // Для yearView, monthView и weekView
        if (data[0].data.length > 1) {
            labels = data[0].data.map(item => item[xLabelOverride]);
            datasets = data.map(store => {
                return {
                    label: store.storeID,
                    data: store.data.map(point => point[yLabelOverride]),
                    fill: false,
                    backgroundColor: getColor(store.storeID, 'background', true),
                    borderColor: getColor(store.storeID, 'border', true),
                    borderWidth: 1
                };
            });
            multipleDataset = true;
            displayLegend = true;
        } else if (data[0].data.length === 1 && Object.keys(data[0].data[0]).length > 2) {
            // Для dayView
            labels = ['Morning', 'Lunch', 'Evening', 'Night'];
            datasets = data.map(store => {
                return {
                    label: store.storeID,
                    data: [
                        store.data[0].Morning,
                        store.data[0].Lunch,
                        store.data[0].Evening,
                        store.data[0].Night
                    ],
                    fill: false,
                    backgroundColor: getColor(store.storeID, 'background', true),
                    borderColor: getColor(store.storeID, 'border', true),
                    borderWidth: 1
                };
            });
            multipleDataset = true;
            displayLegend = true;
        }
    }

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
                        text: xLabelOverride
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabelOverride
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
                },
                legend: {
                    display: displayLegend
                }
            }
        }
    });
}






// Function to map dataset labels to colors from a predefined palette and apply opacity
function getColor(datasetLabel, opacity, multipleDataset, chartType = 'default') {
    var defaultColor = 'rgba(75, 192, 192, ';
    if (chartType === 'line' && !multipleDataset) {
        return 'rgba(75, 192, 192, 1)';
    }

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

    let baseColor = colorPalette[datasetLabel] || defaultColor;
    if (opacity === 'border') {
        baseColor = baseColor + '1)';
    } else {
        baseColor = baseColor + '0.3)';
    }

    return baseColor;
}
