// function needed to interact with the ajax calls and the data from the database
$(document).ready(function () {
    function fetchData() {
        var view = $('#sold-time').val();
        var mode = $('#data-display').val();
        var year = $('#yearDropdown').val();
        var month = $('#monthDropdown').val();
        var week = $('#weekDropdown').val();


        var ready = false;
        switch (view) {
            case "yearView":
                $('#yearDropdown').show();
                $('#monthDropdown, #weekDropdown').hide();
                if (mode && year) {
                    ready = true;
                }
                break;
            case "monthView":
                $('#yearDropdown, #monthDropdown').show();
                $('#weekDropdown').hide();
                if (mode && year && month) {
                    ready = true;
                }
                break;
            case "weekView":
                $('#yearDropdown, #weekDropdown').show();
                $('#monthDropdown').hide();
                if (mode && year && week) {
                    ready = true;
                }
                break;
        }

        if (ready) {
            $('#loading-line-chart').show();
            $.ajax({
                url: '../ajax/getSalesPerTimeframe.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        lineChartSales(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-line-chart').hide();
                }
            });

            $('#loading-stores-sold').show();
            $.ajax({
                url: '../ajax/getSalesPerStore.php',
                type: 'POST',
                data: {
                    view: view,
                    mode: mode,
                    year: year,
                    month: month,
                    week: week
                },
                success: function (response) {
                    if (response.success) {
                        storesValueBarChart(response.data);
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-stores-sold').hide();
                }
            });
        }
    }

    $('#updateButton').click(fetchData);

    $('#sold-time').change(function () {
        var view = $(this).val();
        switch (view) {
            case "yearView":
                $('#yearDropdown').show();
                $('#monthDropdown, #weekDropdown').hide();
                break;
            case "monthView":
                $('#yearDropdown, #monthDropdown').show();
                $('#weekDropdown').hide();
                break;
            case "weekView":
                $('#yearDropdown, #weekDropdown').show();
                $('#monthDropdown').hide();
                break;
            default:
                $('#yearDropdown, #monthDropdown, #weekDropdown').hide();
                break;
        }
    }).trigger('change');
    fetchData();
});

// Showing the total Sales in a given timeframe
function lineChartSales(data) {

    var keys = Object.keys(data[0]);
    var storeID = keys[0];
    var storeValue = keys[1];

    var storeNames = data.map(item => item[storeID]);
    var storeValues = data.map(item => item[storeValue]);

    const overAllSold = echarts.init(document.getElementById('line-chart-sales'));

    var existingChart = echarts.getInstanceByDom(overAllSold);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    var option = {
        title: {
            text: 'Sales Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: storeNames
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Sales',
            type: 'line',
            data: storeValues,
            itemStyle: {
                color: 'rgba(75, 192, 192, 0.8)'
            }
        }]
    };

    overAllSold.setOption(option);
    option && overAllSold.setOption(option);
    overAllSold.resize({width: 1000, height: 500})

}
// Showing the total sales for each store in the selected time frame
function storesValueBarChart(data) {
    var keys = Object.keys(data[0]);
    var storeID = keys[0];
    var storeValue = keys[1];


    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));

    var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    var storeDataWithStoreID = data.map(item => ({
        value: item[storeValue],
        category: item[storeID]
    }));

    storeDataWithStoreID.sort((a, b) => b.value - a.value);

    var sortedStoreData = storeDataWithStoreID.map(item => item.value);
    var sortedStoreID = storeDataWithStoreID.map(item => item.category);

    var option = {
        title: {
            text: 'Sales Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Sales',
            type: 'bar',
            data: sortedStoreData,
            itemStyle: {
                color: 'rgba(75, 192, 192, 0.8)'
            }
        }]
    };

    option && sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500})
}
// Showing the percentage of total sales for each store in comparison to the total sales in the selected time frame
function storesPercentBarChart(data) {
    // Extract the keys from the first data object
    var keys = Object.keys(data[0]);
    var storeData = keys[0];
    var storeID = keys[1];

    // Initialize echarts instance
    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));

    // Dispose existing chart instance if any
    var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    // Map the data to an array of objects containing value and category
    var storeDataWithStoreID = data.map(item => ({
        value: item[storeID],
        category: item[storeData]
    }));

    // Sort the data in descending order
    storeDataWithStoreID.sort((a, b) => b.value - a.value);

    // Calculate the total value
    var totalValue = storeDataWithStoreID.reduce((sum, item) => sum + item.value, 0);

    // Calculate the percentage of total for each store
    var storeDataWithPercentage = storeDataWithStoreID.map(item => ({
        value: (item.value / totalValue * 100).toFixed(2), // convert to percentage and round to 2 decimal places
        category: item.category
    }));

    // Extract the sorted data and categories
    var sortedStoreData = storeDataWithPercentage.map(item => item.value);
    var sortedStoreID = storeDataWithPercentage.map(item => item.category);

    // Set the chart options
    var option = {
        title: {
            text: 'Sales Data as Percentage of Total'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                return params[0].name + ': ' + params[0].data + '%';
            }
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [{
            name: 'Sales',
            type: 'bar',
            data: sortedStoreData,
            itemStyle: {
                color: 'rgba(75, 192, 192, 0.8)'
            }
        }]
    };

    // Set the options on the echarts instance
    sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500});
}


// test Function used to test out changes on graphs
function testfunc(data) {
    var keys = Object.keys(data[0]);
    var labelField = keys[0];
    var valueField = keys[1];

    const overallSold = echarts.init(document.getElementById('line-chart-sales'));

    const storeData = data.map(item => item[labelField]);
    const categories = data.map(item => item[valueField]);

    var option = {
        xAxis: {
            type: 'category',
            data: categories
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: storeData,
                type: 'line'
            },
        ]
    };

    overallSold.setOption(option);
    option && overallSold.setOption(option);
    overallSold.resize({width: 1000, height: 500})
}