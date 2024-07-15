$(document).ready(function () {
    
    //diplay option graph

    $('#bigGraph').hide();

    $('#graph1And2').show();

    $('#graph3And4').show();
    $('#map').show();
    $('#graphCanvas4').hide();
    
    $('#storeInfoNew').hide();



    $('#chartType1, #chartType2, #chartType3, #chartType4, #chartType5').hide();
    $('#grouping1, #grouping2, #grouping3, #grouping4, #grouping5').hide();
    $('#perSize').hide()
    


    //choose file to load and set the tilte
    var ajaxFile1 = '';
    //document.getElementById('bigGraphTitle').textContent = 'Sales per store per month';

    var ajaxFile2 = 'getSalesPerTimeframe';
    document.getElementById('graphTitle1').textContent = 'Sales during chosen time frame';

    var ajaxFile3 = 'getSalesPerStore';
    document.getElementById('graphTitle2').textContent = 'Sales per store during the chosen time frame';

    var ajaxFile4 = 'getSalesPerPizza';

    var ajaxFile5 = 'getCustomerCoordinatesPerStore';
    document.getElementById('graphTitle4').textContent = 'Map of Store and Customers';


    // Function to fetch and display data
    function fetchData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var toggle_percent = $('#stores-sold-toggle').val();

    
        // empty the table of previous value each time a dropdown gets changed
        $('#tablePerTime').empty();
        $('#tablePerStore').empty();

        // check view, show/hide relevant dropdowns and check if the relevant dropdown are set 
        var ready = false
        switch (view) {
            case "completeView":
                $('#yearWithLabel, #monthWithLabel, #weekWithLabel, #timeframeSettingsLabel').hide()
                if (mode) { ready = true };
                break;
            case "yearView":
                $('#yearWithLabel, #timeframeSettingsLabel').show()
                $('#monthWithLabel, #weekWithLabel').hide()
                if (mode && year) { ready = true };
                break;
            case "monthView":
                $('#yearWithLabel, #monthWithLabel, #timeframeSettingsLabel').show()
                $('#weekWithLabel').hide()
                if (mode && year && month) { ready = true };
                break;
            case "weekView":
                $('#yearWithLabel, #weekWithLabel, #timeframeSettingsLabel').show()
                $('#monthWithLabel').hide()
                if (mode && year && week) { ready = true };
                break;
        };


        // if all the relevant data is set, the function continues to make ajax request
        if (ready) {
            //fetchDataGraph1();
            fetchDataGraph2();
            fetchDataGraph3();
            fetchDataGraph4();
            fetchDataGraph5();
        }
    }

    function fetchDataGraph1() {
        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest1) {
            currentAjaxRequest1.abort();
        }

        var canvas = document.getElementById('bigGraphCanvas');
        var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping1').val();
        var chartType = $('#chartType1').val();
        var storeSelection = $('#storeSelection').val();

        $('#bigGraphLoading').show(); // Show loading indicator for first table
        // ajax request for the first data
        currentAjaxRequest1 = $.ajax({
            url: '/ajax/'+ ajaxFile1 +'.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize: perSize,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    
                } else {
                    $('#bigGraphCanvas').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#bigGraphLoading').hide(); // Hide loading indicator when request is complete
            }
        });

        
    }

    function fetchDataGraph2() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest2) {
            currentAjaxRequest2.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas1');
        var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping2').val();
        var chartType = $('#chartType2').val();
        var storeSelection = $('#storeSelection').val();

        $('#graphLoading1').show(); // Show loading indicator for first table
                // ajax request for the first data
        currentAjaxRequest2 = $.ajax({
            url: '/ajax/'+ ajaxFile2 +'.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize:perSize,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'graphCanvas1', chartType, grouping);
                } else {
                    $('#graphCanvas1').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading1').hide(); // Hide loading indicator when request is complete
            }
        });

    }

    function fetchDataGraph3() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest3) {
            currentAjaxRequest3.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas2');
        var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping3').val();
        var chartType = $('#chartType3').val();
        var storeSelection = $('#storeSelection').val();

        $('#graphLoading2').show(); // Show loading indicator for first table
                // ajax request for the first data
        currentAjaxRequest3 = $.ajax({
            url: '/ajax/'+ ajaxFile3 +'.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize:perSize,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'graphCanvas2', chartType, grouping);
                } else {
                    $('#graphCanvas2').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading2').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph4() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest4) {
            currentAjaxRequest4.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas3');
        var ctx = canvas.getContext('2d');

    // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping4').val();
        var chartType = $('#chartType4').val();
        var storeSelection = $('#storeSelection').val();


        $('#graphLoading3').show(); // Show loading indicator for second table 
            // ajax request for the first data
        currentAjaxRequest4 = $.ajax({
            url: '/ajax/'+ ajaxFile4 +'.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize: true,
                storeSelection: storeSelection

            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart

                    createChart(response.data, 'graphCanvas3', chartType, grouping);

                } else {
                    $('#graphCanvas3').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading3').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph5() {

        // Abort previous call if it isn't finished yet
        if (currentAjaxRequest5) {
            currentAjaxRequest5.abort();
        }

        // Remove previous chart
        var canvas = document.getElementById('graphCanvas4');
        var ctx = canvas.getContext('2d');

        // Get the chart instance associated with the canvas
        var chartInstance = Chart.getChart(ctx);

        // Check if the chart instance exists and destroy it if it does
        if (chartInstance) {
            chartInstance.destroy();
        }

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping5').val();
        var chartType = $('#chartType5').val();
        var storeSelection = $('#storeSelection').val();


        $('#graphLoading4').show(); // Show loading indicator for second table 
            // AJAX request for the second data
        currentAjaxRequest5 = $.ajax({
            url: '/ajax/'+ ajaxFile5 +'.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                storeSelection: storeSelection
            },
            success: function (response) {
                if (response.success) {
                    // Call the function from showTable.js
                    mapStores(response.data);
                } else {
                    $('#graphCanvas4').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading4').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    // a map function that shows all stores on a map with their store ID and distance from the main store
    function mapStores(data) {
        var map = L.map('map').setView([40, -120], 4.5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


        stores.forEach(store => {
            L.marker([store.lat, store.lng]).addTo(map)
                .bindPopup(store.name)
                .openPopup();
        });
    }




    

    // Trigger fetchData when any dropdown value changes
    $('#view, #mode, #year, #month, #week, #endDate, #startDate, #timeframeType, #storeSelection').change(fetchData);
    //$('#chartType1, #grouping1').change(fetchDataGraph1);
    $('#chartType2, #grouping2').change(fetchDataGraph2);
    $('#chartType3, #grouping3').change(fetchDataGraph3);
    $('#chartType4, #grouping4').change(fetchDataGraph4);
    $('#chartType5, #grouping5').change(fetchDataGraph5);

    // Trigger fetchData when the page loads
    fetchData();
});