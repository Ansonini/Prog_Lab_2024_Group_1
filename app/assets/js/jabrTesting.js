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
                $('#loading').hide();
                $('#storeTable tbody').html('<tr><td colspan="8">Error fetching data</td></tr>');
            }
        });
    }

    $('#storeDropdown').change(function () {
        fetchStoreInfo();
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    function updateTableHeader(view) {
        const revenueTableHeader = $('#additionalTable thead');
        const pizzaSoldTableHeader = $('#pizzaSoldTable thead');
        revenueTableHeader.empty();
        pizzaSoldTableHeader.empty();

        if (view === 'yearView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'monthView' || view === 'weekView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Revenue</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Year</th>
                    <th>Period</th>
                    <th>Total Pizzas</th>
                </tr>
            `);
        } else if (view === 'dayView') {
            revenueTableHeader.append(`
                <tr>
                    <th>Store ID</th>
                    <th>Morning</th>
                    <th>Lunch</th>
                    <th>Evening</th>
                    <th>Night</th>
                </tr>
            `);
            pizzaSoldTableHeader.append(`
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

    function fetchRevenueData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        updateTableHeader(view);

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
                        const row = $('<tr>');
                        if (view === 'yearView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.period));
                            row.append($('<td>').text(item.revenue));
                        } else if (view === 'monthView' || view === 'weekView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.year));
                            row.append($('<td>').text(item.period));
                            row.append($('<td>').text(item.revenue));
                        } else if (view === 'dayView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.Morning));
                            row.append($('<td>').text(item.Lunch));
                            row.append($('<td>').text(item.Evening));
                            row.append($('<td>').text(item.Night));
                        }
                        tableBody.append(row);
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

    function fetchPizzasSoldData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeDropdown').val();

        updateTableHeader(view);

        $.ajax({
            url: '/BackendTestingJabrail/pizzaSalesPerStore.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success) {
                    const tableBody = $('#pizzaSoldTable tbody');
                    tableBody.empty();

                    const data = response.data;
                    data.forEach(function (item) {
                        const row = $('<tr>');
                        if (view === 'yearView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.period));
                            row.append($('<td>').text(item.totalPizzas));
                        } else if (view === 'monthView' || view === 'weekView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.year));
                            row.append($('<td>').text(item.period));
                            row.append($('<td>').text(item.totalPizzas));
                        } else if (view === 'dayView') {
                            row.append($('<td>').text(item.storeID));
                            row.append($('<td>').text(item.Morning));
                            row.append($('<td>').text(item.Lunch));
                            row.append($('<td>').text(item.Evening));
                            row.append($('<td>').text(item.Night));
                        }
                        tableBody.append(row);
                    });
                } else {
                    $('#pizzaSoldTable tbody').html('<tr><td colspan="4">' + response.message + '</td></tr>');
                }
            },
            error: function () {
                $('#pizzaSoldTable tbody').html('<tr><td colspan="4">Error fetching data</td></tr>');
            }
        });
    }

    $('#view').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    fetchStoreInfo();
    fetchRevenueData();
    fetchPizzasSoldData();
});
