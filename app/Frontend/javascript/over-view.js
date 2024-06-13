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
    if(document.getElementById('data-display').value === 'units') {
        var yAxisLabel = 'Units Sold';
    } else {
        var yAxisLabel = 'Revenue';
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
            left: '2%',
            right: '2%',
            bottom: '10%',
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

    if(document.getElementById('data-display').value === 'units') {
        var yAxisLabel = 'Units Sold';
    } else {
        var yAxisLabel = 'Revenue';
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
            left: '3%',
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
// Showing the percentage of total sales for each store in comparison to the total sales in the selected time frame
function storesPercentBarChart(data) {
    var keys = Object.keys(data[0]);
    var storeData = keys[0];
    var storeID = keys[1];

    const sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));

    var existingChart = echarts.getInstanceByDom(sortedBarchartStores);
    if (existingChart) {
        echarts.dispose(existingChart);
    }

    var storeDataWithStoreID = data.map(item => ({
        value: item[storeID],
        category: item[storeData]
    }));

    storeDataWithStoreID.sort((a, b) => b.value - a.value);

    var totalValue = storeDataWithStoreID.reduce((sum, item) => sum + item.value, 0);

    var storeDataWithPercentage = storeDataWithStoreID.map(item => ({
        value: (item.value / totalValue * 100).toFixed(2), // convert to percentage and round to 2 decimal places
        category: item.category
    }));

    var sortedStoreData = storeDataWithPercentage.map(item => item.value);
    var sortedStoreID = storeDataWithPercentage.map(item => item.category);

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

    sortedBarchartStores.setOption(option);
    sortedBarchartStores.resize({width: 1000, height: 500});
}
function pieChartStores(data) {
    const pieChart = echarts.init(document.getElementById('stores-sold'));
    var option;

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
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ]
    };

    option && pieChart.setOption(option);
    pieChart.resize({width: 500, height: 500})
}
function mapStores(data) {
    document.getElementById('loading-map').style.display = 'flex';

    // Initialize the map and set its view to a specific location and zoom level
    var map = L.map('mappyMap').setView([40.7128, -74.0060], 13);

    // Load and display tile layer on the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hide the loading indicator once the map is fully loaded
    map.on('load', function() {
        document.getElementById('loading-map').style.display = 'none';
    });
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

        var yAxisLabel = document.getElementById('data-display').value === 'units' ? 'Units Sold' : 'Sales';

        var option = {
            title: {
                text: 'Sales Data'
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                    axis: "x"
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