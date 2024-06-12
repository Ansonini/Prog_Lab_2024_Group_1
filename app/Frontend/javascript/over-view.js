$(document).ready(function () {
    function fetchData() {
        var view = $('#sold-time').val();
        var mode = $('#data-display').val();
        var year = $('#yearDropdown').val();
        var month = $('#monthDropdown').val();
        var week = $('#weekDropdown').val();


        var ready = false;
        switch (view) {
            case "year":
                $('#yearDropdown').show();
                $('#monthDropdown, #weekDropdown').hide();
                if (mode && year) { ready = true; }
                break;
            case "month":
                $('#yearDropdown, #monthDropdown').show();
                $('#weekDropdown').hide();
                if (mode && year && month) { ready = true; }
                break;
            case "week":
                $('#yearDropdown, #weekDropdown').show();
                $('#monthDropdown').hide();
                if (mode && year && week) { ready = true; }
                break;
        }

        if (ready) {
            $('#loading-line-chart').show();
            $.ajax({
                url: 'ajax/getSalesPerTimeframe.php',
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
                        lineChartSales(response.data, "line-chart-sales");
                        storesBarChart(response.data, 'stores-sold');
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
                url: 'ajax/getSalesPerStore.php',
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
                        lineChartSales(response.data, "line-chart-sales");
                        storesBarChart(response.data, 'stores-sold');
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

    $('#sold-time').change(function() {
        var view = $(this).val();
        switch (view) {
            case "year":
                $('#yearDropdown').show();
                $('#monthDropdown, #weekDropdown').hide();
                break;
            case "month":
                $('#yearDropdown, #monthDropdown').show();
                $('#weekDropdown').hide();
                break;
            case "week":
                $('#yearDropdown, #weekDropdown').show();
                $('#monthDropdown').hide();
                break;
            default:
                $('#yearDropdown, #monthDropdown, #weekDropdown').hide();
                break;
        }
    }).trigger('change');
});

function lineChartSales(data, chartID) {

    var keys = Object.keys(data[0]);
    var storeData = keys[0];
    var timeValue = keys[1];

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
            data: timeValue
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'Sales',
            type: 'bar',
            data: storeData,
            itemStyle: {
                color: 'rgba(75, 192, 192, 0.8)'
            }

        }]
    };

    overAllSold.setOption(option);
    option && overAllSold.setOption(option);
    overAllSold.resize({width: 1000, height: 500})

}
function storesBarChart(){
    var keys = Object.keys(data[0]);
    var storeData = keys[0];
    var storeID = keys[1];

    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));

    var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    var storeDataWithStoreID = data.map(item => ({
        value: item[storeData],
        category: item[storeID]
    }));

    storeDataWithStoreID.sort((a, b) => a.value - b.value);

    // Extract the sorted data and categories
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
// tes Function used to test out changes on graphs
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