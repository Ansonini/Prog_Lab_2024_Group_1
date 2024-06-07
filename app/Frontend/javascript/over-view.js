function lineChartSales() {
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
/*
           const overallSold = echarts.init(document.getElementById('line-chart-sales'));

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
                       data: [150, 230, 224, 218, 135, 147, 260],
                       type: 'line'
                   }
               ]
           };

           overallSold.setOption(option);

           // Make the chart responsive
           window.addEventListener('resize', function () {
               overallSold.resize();
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
    var option;

    option = {
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