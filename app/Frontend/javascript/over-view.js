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

    window.addEventListener('resize', function () {
        overallSold.resize({width: 1000, height: 500});
    });
}
/*  // trying to fetch data from the database to display in the echarts line chart
    const overallSold = echarts.init(document.getElementById('line-chart-sales'));
    fetch('app/Backend/phpQueries/pizzaBoughtTogethers.php')
        .then(response => response.json())
        .then(data => {
            var option = {
                title: {
                    text: 'Number of Pizzas Sold',
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value',
                    min: 0
                },
                series: [
                    {
                        data: data,
                        type: 'line'
                    }
                ]
            };
            overallSold.setOption(option);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


             old test code using the Chart.js framework instead of echarts
           var ctx = document.getElementById('line-chart-sales').getContext('2d');
           new Chart(ctx, {
               type: 'bar',
               data: {
                   labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                   datasets: [{
                       label: 'Number of Pizzas Sold',
                       data: [12, 19, 3, 5, 2, 3, 9],
                       backgroundColor: [
                           'rgba(54, 162, 235, 0.2)',
                       ],
                       borderColor: [
                           'rgba(54, 162, 235, 1)',
                       ],
                       borderWidth: 1
                   }]
               },
               options: {
                   responsive: true,
                   maintainAspectRatio: true,
                   aspectRatio: 2.5,
                   scales: {
                       yAxes: [{
                           ticks: {
                               beginAtZero: true
                           }
                       }]
                   }
               }
           });

       }*/

function storesBarChart(){
    var sortedBarchartStores = echarts.init(document.getElementById('stores-sold'));
    var option = {
        dataset: [
            {
                dimensions: ['storeID','score'],
                source: [
                    ['Store-1',314],
                    ['Store-2',351],
                    ['Store-3',287],
                    ['Store-4',219],
                    ['Store-5',253],
                    ['Store-6',165],
                    ['Store-7',318],
                    ['Store-8',366]
                ]
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'score', order: 'desc' }
                }
            }
        ],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        series: {
            type: 'bar',
            encode: { x: 'name', y: 'score' },
            datasetIndex: 1
        }
    };

    option && sortedBarchartStores.setOption(option);
    /* old test code using the Chart.js framework instead of echarts
   var ctx = document.getElementById('stores-sold').getContext('2d');
   new Chart(ctx, {
       type: 'bar',
       data: {
           labels: ['Store 1', 'Store 2', 'Store 3', 'Store 4', 'Store 5'],
           datasets: [{
               label: 'Number of Pizzas Sold',
               data: [12, 19, 3, 5, 2],
               backgroundColor: [
                   'rgba(54, 162, 235, 0.2)',
               ],
               borderColor: [
                   'rgba(54, 162, 235, 1)',
               ],
               borderWidth: 1
           }]
       },
       options: {
           responsive: true,
           maintainAspectRatio: true,
           aspectRatio: 2.5,
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   });*/
}

function testfunc() {
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