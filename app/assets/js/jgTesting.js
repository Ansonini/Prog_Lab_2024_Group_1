$(document).ready(function () {
    // Function to fetch and display data
    function fetchData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();

    
        // empty the table of previous value each time a dropdown gets changed
        $('#tablePerTime').empty();
        $('#tablePerStore').empty();

        // check view, show/hide relevant dropdowns and check if the relevant dropdown are set 
        var ready = false
        switch (view) {
            case "completeView":
                $('#year, #month, #week, #timeframeSettingsLabel').hide()
                if (mode) { ready = true };
                break;
            case "yearView":
                $('#year, #timeframeSettingsLabel').show()
                $('#month, #week').hide()
                if (mode && year) { ready = true };
                break;
            case "monthView":
                $('#year, #month, #timeframeSettingsLabel').show()
                $('#week').hide()
                if (mode && year && month) { ready = true };
                break;
            case "weekView":
                $('#year, #week, #timeframeSettingsLabel').show()
                $('#month').hide()
                if (mode && year && week) { ready = true };
                break;
        };


        // if all the relevant data is set, the function continues to make ajax request
        if (ready) {

            fetchDataGraph1();
            fetchDataGraph2();
            fetchDataGraph3();
            fetchDataGraph4();
            fetchDataGraph5();
        }
    }

    function fetchDataGraph1() {

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping1').val();
        var chartType = $('#chartType1').val();

        $('#bigGraph1Loading').show(); // Show loading indicator for first table
        // ajax request for the first data
        $.ajax({
            url: '/ajax/getSalesPerPizzaOverTime.php',
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
                    // Call the functions from to display the table and the chart
                    console.log(grouping);
                    createChart(response.data, 'bigGraph1Canvas', chartType, grouping);
                } else {
                    $('#bigGraph1').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#bigGraph1Loading').hide(); // Hide loading indicator when request is complete
            }
        });

        
    }

    function fetchDataGraph2() {

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping2').val();
        var chartType = $('#chartType2').val();

        $('#smallGraph1Canvas1Loading').show(); // Show loading indicator for first table
                // ajax request for the first data
        $.ajax({
            url: '/ajax/getSalesPerTimeframe.php',
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
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'smallGraph1Canvas1', chartType, grouping);
                } else {
                    $('#smallGraph1Canvas1').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#smallGraph1Canvas1Loading').hide(); // Hide loading indicator when request is complete
            }
        });

    }

    function fetchDataGraph3() {

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping3').val();
        var chartType = $('#chartType3').val();

        $('#smallGraph1Canvas2Loading').show(); // Show loading indicator for first table
                // ajax request for the first data
        $.ajax({
            url: '/ajax/getSalesPerStorePerMonth.php',
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
                    // Call the functions from to display the table and the chart
                    createChart(response.data, 'smallGraph1Canvas2', chartType, grouping);
                } else {
                    $('#smallGraph1Canvas2').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#smallGraph1Canvas2Loading').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph4() {

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping4').val();
        var chartType = $('#chartType4').val();


        $('#loading').show(); // Show loading indicator for second table 
            // ajax request for the first data
        $.ajax({
            url: '/ajax/getSalesPerPizza.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                perSize:perSize

            },
            success: function (response) {
                if (response.success) {
                    // Call the functions from to display the table and the chart
                    displayJsonTable(response.data, "tablePerTime");

                    createChart(response.data, 'salesChart', chartType, grouping);
                } else {
                    $('#salesPerTime').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#loading').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    function fetchDataGraph5() {

        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();
        var perSize = $('#perSize').val();
        var grouping = $('#grouping5').val();
        var chartType = $('#chartType5').val();


        $('#loading2').show(); // Show loading indicator for second table 
            // AJAX request for the second data
        $.ajax({
            url: '/ajax/getBumpChartPizza.php',
            type: 'POST',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week,
                rankingSize: 15
            },
            success: function (response) {
                if (response.success) {
                    // Call the function from showTable.js
                    displayJsonTable(response.data, "tablePerStore");

                    createChart(response.data, 'salesChartPerStore', chartType, grouping, true);
                } else {
                    $('#salesPerStore').html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#loading2').hide(); // Hide loading indicator when request is complete
            }
        });
    }

    

    // Trigger fetchData when any dropdown value changes
    $('#view, #mode, #year, #month, #week, #endDate, #startDate, #timeframeType, #perSize').change(fetchData);
    $('#chartType1, #grouping1').change(fetchDataGraph1);
    $('#chartType2, #grouping2').change(fetchDataGraph2);
    $('#chartType3, #grouping3').change(fetchDataGraph3);
    $('#chartType4, #grouping4').change(fetchDataGraph4);
    $('#chartType5, #grouping5').change(fetchDataGraph5);

    // Trigger fetchData when the page loads
    fetchData();
});