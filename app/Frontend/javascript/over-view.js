// function needed to interact with the ajax calls and the data from the database
$(document).ready(function () {
    function fetchData() {
        var view = $('#sold-time').val();
        var mode = $('#data-display').val();
        var year = $('#yearDropdown').val();
        var month = $('#monthDropdown').val();
        var week = $('#weekDropdown').val();
        var toggle_percent = $('#stores-sold-toggle').val();
        var pizzaSize = $('#pizza-size').val();

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
            $('#loading-map').show();
            $.ajax({
                url: '../ajax/getStoreInfo.php',
                type: 'POST',
                success: function (response) {
                    if (response.success) {
                        mapStores(response);
                    }else {
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
// showing a heatmap of the sales per day and time period
function heatmap(data) {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

// prettier-ignore
    const hours = [
        '12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a', '10a', '11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'
    ];
// prettier-ignore
    const days = [
        'Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    ];
// prettier-ignore
    data = [[0, 0, 5], [0, 1, 1], [0, 2, 0],
        [0, 3, 0], [0, 4, 0], [0, 5, 0],
        [0, 6, 0], [0, 7, 0], [0, 8, 0],
        [0, 9, 0], [0, 10, 0], [0, 11, 2],
        [0, 12, 4], [0, 13, 1], [0, 14, 1],
        [0, 15, 3], [0, 16, 4], [0, 17, 6],
        [0, 18, 4], [0, 19, 4], [0, 20, 3],
        [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]

        .map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
    option = {
        tooltip: {
            position: 'top'
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: days,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [
            {
                name: 'Punch Card',
                type: 'heatmap',
                data: data,
                label: {
                    show: true
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    option && myChart.setOption(option);

}
// shows a piechart based the most sold Pizza times (based on size of the pizza, can also show all pizzas)
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
// a map function that shows all stores on a map with their store ID and distance from the main store
function mapStores(stores) {
    var map = L.map('mappyMap').setView([50.13053355, 8.69233311], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hide the loading indicator once the map is fully loaded
    map.on('load', function() {
        document.getElementById('loading-map').style.display = 'none';
    });
    stores.forEach(store => {
        var marker = L.marker([store.latitude, store.longitude]).addTo(map);
        marker.bindTooltip(`Store ID: ${store.storeID}<br>X: ${store.distance}`, {permanent: false});
    });
    // Show the map container
    document.getElementById('mappyMap').style.display = 'block';
}
// shows a bump chart of the Top 10 pizza ranked based on the sales
function bumpChartPizzaRanking(data) {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    const names = [
        'Orange',
        'Tomato',
        'Apple',
        'Sakana',
        'Banana',
        'Iwashi',
        'Snappy Fish',
        'Lemon',
        'Pasta'
    ];
    const years = ['2001', '2002', '2003', '2004', '2005', '2006'];
    const shuffle = (array) => {
        let currentIndex = array.length;
        let randomIndex = 0;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex]
            ];
        }
        return array;
    };
    const generateRankingData = () => {
        const map = new Map();
        const defaultRanking = Array.from({ length: names.length }, (_, i) => i + 1);
        for (const _ of years) {
            const shuffleArray = shuffle(defaultRanking);
            names.forEach((name, i) => {
                map.set(name, (map.get(name) || []).concat(shuffleArray[i]));
            });
        }
        return map;
    };
    const generateSeriesList = () => {
        const seriesList = [];
        const rankingMap = generateRankingData();
        rankingMap.forEach((data, name) => {
            const series = {
                name,
                symbolSize: 20,
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                endLabel: {
                    show: true,
                    formatter: '{a}',
                    distance: 20
                },
                lineStyle: {
                    width: 4
                },
                data
            };
            seriesList.push(series);
        });
        return seriesList;
    };
    option = {
        title: {
            text: 'Bump Chart (Ranking)'
        },
        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            },
            axisLabel: {
                margin: 30,
                fontSize: 16
            },
            boundaryGap: false,
            data: years
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 30,
                fontSize: 16,
                formatter: '#{value}'
            },
            inverse: true,
            interval: 1,
            min: 1,
            max: names.length
        },
        series: generateSeriesList()
    };

    option && myChart.setOption(option);

}
// shows a bump chart of the Top 10 stores ranked based on the sales/toggle between units and revenue
function bumpChartStoreRanking(data, mode) {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    const names = [
        'Orange',
        'Tomato',
        'Apple',
        'Sakana',
        'Banana',
        'Iwashi',
        'Snappy Fish',
        'Lemon',
        'Pasta'
    ];
    const years = ['2001', '2002', '2003', '2004', '2005', '2006'];
    const shuffle = (array) => {
        let currentIndex = array.length;
        let randomIndex = 0;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex]
            ];
        }
        return array;
    };
    const generateRankingData = () => {
        const map = new Map();
        const defaultRanking = Array.from({ length: names.length }, (_, i) => i + 1);
        for (const _ of years) {
            const shuffleArray = shuffle(defaultRanking);
            names.forEach((name, i) => {
                map.set(name, (map.get(name) || []).concat(shuffleArray[i]));
            });
        }
        return map;
    };
    const generateSeriesList = () => {
        const seriesList = [];
        const rankingMap = generateRankingData();
        rankingMap.forEach((data, name) => {
            const series = {
                name,
                symbolSize: 20,
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                endLabel: {
                    show: true,
                    formatter: '{a}',
                    distance: 20
                },
                lineStyle: {
                    width: 4
                },
                data
            };
            seriesList.push(series);
        });
        return seriesList;
    };
    option = {
        title: {
            text: 'Bump Chart (Ranking)'
        },
        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: true
            },
            axisLabel: {
                margin: 30,
                fontSize: 16
            },
            boundaryGap: false,
            data: years
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 30,
                fontSize: 16,
                formatter: '#{value}'
            },
            inverse: true,
            interval: 1,
            min: 1,
            max: names.length
        },
        series: generateSeriesList()
    };

    option && myChart.setOption(option);

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