// function needed to interact with the ajax calls and the data from the database
$(document).ready(function () {
    function fetchData() {
        var view = $('#sold-time').val();
        var mode = $('#data-display').val();
        var year = $('#yearDropdown').val();
        var month = $('#monthDropdown').val();
        var week = $('#weekDropdown').val();
        var toggle_percent = $('#stores-sold-toggle').val();


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
                        if (toggle_percent === 'percent') {
                            storesPercentBarChart(response.data);
                        }else {
                            storesValueBarChart(response.data);
                        }
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
            $('#loading-bar-no-percent').show();
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
                        if (toggle_percent === 'percent') {
                            storesPercentBarChart(response.data);
                        }else {
                            storesValueBarChart(response.data);
                        }
                    } else {
                        $('#chart-container').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading-bar-no-percent').hide();
                }
            });
        }
    }
    fetchData();
    $('#updateButton').click(fetchData);

    $('#sold-time').change(function () {
        var view = $(this).val();
        switch (view) {
            case "yearView":
                $('#yearDropdown').show();
                $('#monthDropdown, #monthDropdownTitle, #weekDropdown, #weekDropdownTitle').hide();
                break;
            case "monthView":
                $('#yearDropdown, #monthDropdown, #monthDropdownTitle').show();
                $('#weekDropdown, #weekDropdownTitle').hide();
                break;
            case "weekView":
                $('#yearDropdown, #weekDropdown, #weekDropdownTitle').show();
                $('#monthDropdown, #monthDropdownTitle').hide();
                break;
            default:
                $('#yearDropdown, #monthDropdown, #weekDropdown').hide();
                break;
        }
    }).trigger('change');

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
    if(document.getElementById('data-display').value === 'units') {
        var yAxisLabel = 'Units Sold in Thousands';
    } else {
        var yAxisLabel = 'Revenue in Thousands';
    }
    if(document.getElementById('sold-time').value === 'weekView') {
        var xAxisLabel = 'Week Days';
    } else if (document.getElementById('sold-time').value === 'monthView') {
        var xAxisLabel = 'Month in Days';
    }else  {
        var xAxisLabel = 'Year in Months';
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
        grid: {
            left: '6%',
            right: '2%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: storeNames,
            name: xAxisLabel,
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: {
                fontSize: 16
            }
        },
        yAxis: {
            type: 'value',
            name: yAxisLabel,
            nameTextStyle: {
                fontSize: 16
            },
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
    overAllSold.resize({width: 1000, height: 400})

}
// Showing the total Sales/Revenue for each store in the selected time frame
function storesValueBarChart(data) {
    var keys = Object.keys(data[0]);
    var storeID = keys[0];
    var storeValue = keys[1];


    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

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

    if(document.getElementById('data-display').value === 'units') {
        var yAxisLabel = 'Units Sold in Thousands';
    } else {
        var yAxisLabel = 'Revenue in Thousands';
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
        grid: {
            left: '8%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID,
            name: 'Store Names',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45
            },
        },
        yAxis: {
            type: 'value',
            name: yAxisLabel,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45
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

    option && sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500})
}
// Showing the percentage of total Sales/Revenue for each store in comparison to the total sales in the selected time frame
function storesPercentBarChart(data) {
    var keys = Object.keys(data[0]);
    var storeData = keys[0];
    var storeID = keys[1];

    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

    var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    var storeDataWithStoreID = data.map(item => ({
        value: item[storeID],
        category: item[storeData]
    }));

    storeDataWithStoreID.sort((a, b) => b.value - a.value);

    var totalValue = storeDataWithStoreID.reduce((sum, item) => sum + parseFloat(item.value), 0);

    var sortedStoreData = storeDataWithStoreID.map(item => {
        return parseFloat(((item.value / totalValue) * 100).toFixed(2));
    });

    var sortedStoreID = storeDataWithStoreID.map(item => item.category);

    var yAxisLabel;
    if (document.getElementById('data-display').value === 'units') {
        yAxisLabel = 'Percentage of Units Sold';
    } else {
        yAxisLabel = 'Percentage of Revenue';
    }

    var option = {
        title: {
            text: 'Sales Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var total = 0;
                params.forEach(function (item) {
                    total += item.value;
                });
                return params[0].name + '<br>' + params.map(function (item) {
                    return item.marker + item.seriesName + ' % : ' + item.value.toFixed(2) + '%';
                })//.join('<br>') + '<br>Total: ' + total.toFixed(2) + '%';
            }
        },

        grid: {
            left: '8%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID,
            name: 'Store Names',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45
            },
        },
        yAxis: {
            type: 'value',
            name: yAxisLabel,
            nameLocation: 'end',
            nameGap: 10,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}%',
                rotate: 45,
                padding: [0, 20, 0, 0]
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

    sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500});
}
function updatePieChart() {
    const showAll = document.getElementById('showAll').checked;
    const showSmall = document.getElementById('showSmall').checked;
    const showMedium = document.getElementById('showMedium').checked;
    const showLarge = document.getElementById('showLarge').checked;

    if (event.target !== showAll && event.target.checked) {
        showAll.checked = false;
    }

    const seriesData = [
        { value: 1048, name: 'Others', size: 'Large' },
        { value: 735, name: 'Pepperoni', size: 'Medium' },
        { value: 580, name: 'Margarita', size: 'Small' },
        { value: 484, name: 'Hawaii', size: 'Medium' },
        { value: 300, name: 'Chicken BBQ', size: 'Large' }
    ];

    const filteredData = seriesData.filter(item => {
        if (showAll) return true;
        if (showSmall && item.size === 'Small') return true;
        if (showMedium && item.size === 'Medium') return true;
        if (showLarge && item.size === 'Large') return true;
        return false;
    });

    option.series[0].data = filteredData;
    pieChart.setOption(option);
}

function pieChartStores() {
    const pieChart = echarts.init(document.getElementById('pie-chart'));
    option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Others', size: 'Large' },
                    { value: 735, name: 'Pepperoni', size: 'Medium' },
                    { value: 580, name: 'Margarita', size: 'Small' },
                    { value: 484, name: 'Hawaii', size: 'Medium' },
                    { value: 300, name: 'Chicken BBQ', size: 'Large' }
                ],
                color: ['#808080', '#98FF98', '#efc164', '#d287eb', '#87CEEB']
            }
        ]
    };

    pieChart.setOption(option);
    pieChart.resize({ width: 500, height: 500 });
}

function mapStores() {
    var map = L.map('mappyMap').setView([50.13053355, 8.69233311], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hide the loading indicator once the map is fully loaded
    map.on('load', function() {
        document.getElementById('loading-map').style.display = 'none';
    });

    // Show the map container
    document.getElementById('mappyMap').style.display = 'block';
}

// to filter the dropdown list of stores
function filterDropdown() {
    var input, filter, div, a, i;
    input = document.getElementById("dropdownSearch");
    filter = input.value.toUpperCase();
    div = document.getElementsByClassName("dropdown-content")[0];
    a = div.getElementsByTagName("a");

    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
// to go to the store page of the store  that was selected
function navigateToStore(storeId) {
    console.log("Navigating to store " + storeId);
}



// test Function used to test out changes on graphs
function testfunc(data) {
    var keys = Object.keys(data[0]);
    var storeID = keys[0];
    var storeValue = keys[1];

    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

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

    var yAxisLabel = document.getElementById('data-display').value === 'units' ? 'Units Sold' : 'Sales';

    var option = {
        title: {
            text: 'Sales Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                var category = params[0].name;
                var value = params[0].data;
                return `Store: ${category}<br/>Value: ${value}`;
            }
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID,
            name: 'Store Names',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45,
                fontSize: 14
            }
        },
        yAxis: {
            type: 'value',
            name: yAxisLabel,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                fontSize: 14
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

    sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500});
}
function testfunction2(data) {
    var keys = Object.keys(data[0]);
    var storeID = keys[0];
    var storeValue = keys[1];


    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold-barchart'));

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

    if(document.getElementById('data-display').value === 'units') {
        var yAxisLabel = 'Units Sold in Thousands';
    } else {
        var yAxisLabel = 'Revenue in Thousands';
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
        grid: {
            left: '8%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: sortedStoreID,
            name: 'Store Names',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45
            },
        },
        yAxis: {
            type: 'value',
            name: yAxisLabel,
            nameTextStyle: {
                fontSize: 16
            },
            axisLabel: {
                formatter: '{value}',
                rotate: 45
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

    option && sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500})
}