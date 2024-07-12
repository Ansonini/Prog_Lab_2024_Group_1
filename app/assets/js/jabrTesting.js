$(document).ready(function () {
    function fetchStoreInfo() {
        $('#loading').show(); 

        const storeID = $('#storeDropdown').val();

        $.ajax({
            url: '/BackendTestingJabrail/storeLocationTransfer.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID },
            success: function (response) {
                $('#loading').hide(); 
                if (response.success) {
                    const tableBody = $('#storeTable tbody');
                    tableBody.empty(); 

                    const data = response.data;
                    data.forEach(function (store) {
                        const row = $('<tr>');
                        row.append($('<td>').text(store.storeID));
                        row.append($('<td>').text(store.zipcode));
                        row.append($('<td>').text(store.stateAbbr));
                        row.append($('<td>').text(store.latitude));
                        row.append($('<td>').text(store.longitude));
                        row.append($('<td>').text(store.city));
                        row.append($('<td>').text(store.stateFull));
                        row.append($('<td>').text(store.distance));
                        tableBody.append(row);
                    });
                } else {
                    $('#storeTable tbody').html('<tr><td colspan="8">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#loading').hide(); // Hide loading indicator
                $('#storeTable tbody').html('<tr><td colspan="8">Error fetching data</td></tr>');
            }
        });
    }

    
    $('#storeDropdown').change(function () {
        fetchStoreInfo();
    });

    function updateTableHeader(view) {
        const tableHeader = $('#additionalTable thead');
        tableHeader.empty();

        if (view === 'yearView') {
            tableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
        } else if (view === 'monthView' || view === 'weekView') {
            tableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
        } else if (view === 'dayView') {
            tableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Morning</th>
                    <th>Lunch</th>
                    <th>Evening</th>
                    <th>Night</th>
                </tr>
            `);
        }
    }

    function fetchData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

       
        switch (view) {
            case "yearView":
                $('#timeframeSettings').hide();
                break;
            case "monthView":
            case "weekView":
            case "dayView":
                $('#timeframeSettings').show();
                break;
        }

        
        updateTableHeader(view);

        // Fetch revenue data
        $.ajax({
            url: '/BackendTestingJabrail/revenuePerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success) {
                    const tableBody = $('#additionalTable tbody');
                    tableBody.empty(); 

                    const data = response.data;
                    data.forEach(function (item) {
                        item.data.forEach(function (entry) {
                            const row = $('<tr>');
                            if (view === 'yearView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                            } else if (view === 'monthView' || view === 'weekView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.year));
                                row.append($('<td>').text(entry.period));
                                row.append($('<td>').text(entry.revenue));
                            } else if (view === 'dayView') {
                                row.append($('<td>').text(item.storeID));
                                row.append($('<td>').text(entry.Morning));
                                row.append($('<td>').text(entry.Lunch));
                                row.append($('<td>').text(entry.Evening));
                                row.append($('<td>').text(entry.Night));
                            }
                            tableBody.append(row);
                        });
                    });
                } else {
                    $('#additionalTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#additionalTable tbody').html('<tr><td colspan="4">Error fetching data</td></tr>');
            }
        });
    }

    
    $('#view').change(function () {
        fetchData();
    });

    
    $('#year').change(function () {
        fetchData();
    });

    
    fetchStoreInfo();
    fetchData();
});
