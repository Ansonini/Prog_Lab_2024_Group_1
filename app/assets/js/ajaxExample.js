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
     // Function to fetch and display store locations
     function fetchStoreLocations() {
        $('#loading4').show(); // Show loading indicator for store locations table

        // AJAX request for store locations data
        $.ajax({
            url: '/BackendTestingJabrail/storeLocationTransfer.php',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                $('#loading4').hide(); // Hide loading indicator when request is complete

                if (response.success) {
                    const tableBody = $('#storeLocationsTable tbody');
                    tableBody.empty(); // Clear existing table data

                    const data = response.data;

                    // Fill the table with new data
                    data.forEach(function (store) {
                        const row = $('<tr>');

                        row.append($('<td>').text(store.storeID));
                        row.append($('<td>').text(store.zipcode));
                        row.append($('<td>').text(store.state_abbr));
                        row.append($('<td>').text(store.latitude));
                        row.append($('<td>').text(store.longitude));
                        row.append($('<td>').text(store.city));
                        row.append($('<td>').text(store.state));
                        row.append($('<td>').text(store.distance));

                        tableBody.append(row);
                    });
                } else {
                    $('#storeLocationsTable tbody').html('<tr><td colspan="8">Not available</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                $('#loading4').hide(); // Hide loading indicator when request is complete
                console.log('AJAX Error:', status, error);
            }
        });
    }
    
    function fetchSalesPerHours() {
        var view = $('#view').val();
        var mode = $('#mode').val();
        var year = $('#year').val();
        var month = $('#month').val();
        var week = $('#week').val();

        $('#loading4').show();

        $.ajax({
            url: '/ajax/salesPerHours.php',
            type: 'POST',
            dataType: 'json',
            data: {
                view: view,
                mode: mode,
                year: year,
                month: month,
                week: week
            },
            success: function (response) {
                $('#loading4').hide();

                if (response.success) {
                    const tableBody = $('#salesPerHoursTable tbody');
                    tableBody.empty();

                    const data = response.data;

                    data.forEach(function (interval) {
                        const row = $('<tr>');

                        row.append($('<td>').text(interval.interval));
                        row.append($('<td>').text(interval.totalPizzas));

                        tableBody.append(row);
                    });
                } else {
                    $('#salesPerHoursTable tbody').html('<tr><td colspan="2">Not available</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                $('#loading4').hide();
                console.log('AJAX Error:', status, error);
            }
        });
    }
        function fetchStoreClientDistance() {
            $('#loading').show(); // Show loading indicator
    
            $.ajax({
                url: '/BackendTestingJabrail/storeClientDistance.php', 
                type: 'POST',
                dataType: 'json',
                success: function (response) {
                    $('#loading').hide(); // Hide loading indicator
    
                    if (response.success) {
                        const tableBody = $('#storeClientDistanceTable tbody');
                        tableBody.empty(); 
    
                        const data = response.data;
    
                        data.forEach(function (row) {
                            const tableRow = $('<tr>');
    
                            tableRow.append($('<td>').text(row.orderID));
                            tableRow.append($('<td>').text(row.customerID));
                            tableRow.append($('<td>').text(row.storeID));
                            tableRow.append($('<td>').text(row.distance));
    
                            tableBody.append(tableRow);
                        });
                    } else {
                        $('#storeClientDistanceTable tbody').html('<tr><td colspan="4">Not available</td></tr>');
                    }
                },
                error: function (xhr, status, error) {
                    $('#loading').hide(); // Hide loading indicator
                    console.log('AJAX Error:', status, error);
                }
            });
        }
        function fetchPizzaSalesPerPlacement() {
            var filterType = $('#filterType').val();
    
            $('#loading').show(); // Show loading indicator
    
            $.ajax({
                url: '/BackendTestingJabrail/pizzaSalesPerPlacement.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    filterType: filterType
                },
                success: function (response) {
                    $('#loading').hide(); // Hide loading indicator
    
                    if (response.success) {
                        const tableBody = $('#salesPerPlacementTable tbody');
                        tableBody.empty(); // Clear existing table data
    
                        const data = response.data;
    
                        // Fill the table with new data
                        data.forEach(function (row) {
                            const tableRow = $('<tr>');
    
                            tableRow.append($('<td>').text(row[filterType]));
                            tableRow.append($('<td>').text(row.totalPizzas));
    
                            tableBody.append(tableRow);
                        });
                    } else {
                        $('#salesPerPlacementTable tbody').html('<tr><td colspan="2">Not available</td></tr>');
                    }
                },
                error: function (xhr, status, error) {
                    $('#loading').hide(); // Hide loading indicator
                    console.log('AJAX Error:', status, error);
                }
            });
        }
    
    
    
     // Trigger fetchData when any dropdown value changes
 $('#view, #mode, #year, #month, #week').change(fetchData);
 $('#view, #mode, #year, #month, #week').change(fetchSalesPerHours);
 $('#fetchDataBtn').click(fetchPizzaSalesPerPlacement);

    // Trigger fetchData when the page loads
    fetchData();
    fetchSalesPerHours();
    fetchStoreLocations();
    fetchStoreClientDistance()
    fetchPizzaSalesPerPlacement();
});
    

