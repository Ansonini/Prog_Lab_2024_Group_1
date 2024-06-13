$(document).ready(function () {
    // Function to fetch and display data
    function fetchData() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();

        // empty the table of previous value each time a dropdown gets changed
        $('#tablePerTime').empty();
        $('#tablePerStore').empty();

        // check view, show/hide relevant dropdowns and check if the relevant dropdown are set 
        var ready = false
        switch (view) {
            case "completeView":
                $('#year, #month, #week').hide()
                if (mode) { ready = true };
                break;
            case "yearView":
                $('#year').show()
                $('#month, #week').hide()
                if (mode && year) { ready = true };
                break;
            case "monthView":
                $('#year, #month').show()
                $('#week').hide()
                if (mode && year && month) { ready = true };
                break;
            case "weekView":
                $('#year, #week').show()
                $('#month').hide()
                if (mode && year && week) { ready = true };
                break;
        }

        // if all the relevant data is set, the function continues to make ajax request
        if (ready) {
            $('#loading').show(); // Show loading indicator for first table
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
                        displayJsonTable(response.data, "tablePerTime");

                        createChart(response.data, 'salesChart', 'bar');
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

            $('#loading2').show(); // Show loading indicator for second table 
            // AJAX request for the second data
            $.ajax({
                url: '/ajax/getSalesPerStore.php',
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
                        // Call the function from showTable.js
                        displayJsonTable(response.data, "tablePerStore");

                        createChart(response.data, 'salesChartPerStore', "bar");
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

            $('#loading3').show(); // Show loading indicator for first table
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
                        createChart(response.data, 'salesChartPerStorePerMonth', 'line');
                    } else {
                        $('#salesPerStorePerMonth').html('<p>' + response.message + '</p>');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('AJAX Error:', status, error);
                },
                complete: function () {
                    $('#loading3').hide(); // Hide loading indicator when request is complete
                }
            });
        }
    }

    // Trigger fetchData when any dropdown value changes
    $('#view, #mode, #year, #month, #week').change(fetchData);

    // Trigger fetchData when the page loads
    fetchData();
});