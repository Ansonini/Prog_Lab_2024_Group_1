function lineChartSales() {

    const overallSold = echarts.init(document.getElementById('line-chart-sales'));

    var storeData = [150, 230, 224, 218, 135, 147, 260];
    var categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
function storesBarChart(){
    var sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));

    // Original data
    var data = [120, 200, 150, 80, 70, 110, 130];
    var categories = ['Store-ID1', 'Store-ID2', 'Store-ID3', 'Store-ID4', 'Store-ID5', 'Store-ID6', 'Store-ID7'];

    // Combine data and categories into an array of objects
    var dataWithCategories = data.map((value, index) => ({
        value: value,
        category: categories[index]
    }));

    // Sort the array of objects by value in descending order
    dataWithCategories.sort((a, b) => a.value - b.value);

    // Extract the sorted data and categories
    var sortedData = dataWithCategories.map(item => item.value);
    var sortedCategories = dataWithCategories.map(item => item.category);

    var option = {
        yAxis: {
            type: 'category',
            data: sortedCategories
        },
        xAxis: {
            type: 'value'
        },
        series: [
            {
                data: sortedData,
                type: 'bar'
            },
        ]
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