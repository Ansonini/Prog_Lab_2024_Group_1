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
