$(document).ready(function () {
    

    
   

    $('#graph1And2').show();

    function fetchStoreInfo() {
        $('#loading').show();

        const storeID = $('#storeSelection').val();

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

    function fetchRevenueData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeSelection').val();
        $('#graphLoading1').show();
        $.ajax({
            url: '/BackendTestingJabrail/revenuePerStoreGraphs.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success && response.data && response.data.length > 0) {
                    let xLabel, yLabel = 'revenue';
                    switch (view) {
                        case 'yearView':
                        case 'monthView':
                        case 'weekView':
                        case 'dayView':
                            xLabel = 'period';
                            break;
                    }
                    createChart(response.data, 'graphCanvas1', $('#chartType2').val(), xLabel, yLabel);
                } else {
                    $('#graphCanvas1').html('<p>' + (response.message || 'No data available') + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading1').hide();
            }
        });
    }
    
    function fetchPizzasSoldData() {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeSelection').val();
        $('#graphLoading2').show();
        $.ajax({
            url: '/BackendTestingJabrail/pizzaSalesPerStoreGraphs.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, view: view, year: year },
            success: function (response) {
                if (response.success && response.data && response.data.length > 0) {
                    let xLabel, yLabel = 'totalPizzas';  // Убедитесь, что здесь используется 'totalPizzas'
                    switch (view) {
                        case 'yearView':
                        case 'monthView':
                        case 'weekView':
                            xLabel = 'period';
                            break;
                        case 'dayView':
                            xLabel = 'period';
                            break;
                    }
                    createChart(response.data, 'graphCanvas2', $('#chartType3').val(), xLabel, yLabel);
                } else {
                    $('#graphCanvas2').html('<p>' + (response.message || 'No data available') + '</p>');
                }
            },
            error: function (xhr, status, error) {
                console.log('AJAX Error:', status, error);
            },
            complete: function () {
                $('#graphLoading2').hide();
            }
        });
    }
    
    
    
    function fetchData(url, tableId) {
        var view = $('#view').val();
        var year = $('#year').val();
        var storeID = $('#storeSelection').val();

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
    }
    $('#view').change(function () {
        
        fetchData();
        fetchRevenueData();
        fetchPizzasSoldData();
        
    });

    
    $('#year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
        
    });
    $('#view').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });

    $('#year').change(function () {
        fetchRevenueData();
        fetchPizzasSoldData();
    });
   
    $('#chartType2').change(function () {
        
        fetchData();
        fetchRevenueData();
        fetchPizzasSoldData();
        
    });
    $('#chartType2').change(function () {
        
        
        fetchRevenueData();
        
        
    });
    $('#chartType3').change(function () {
        
        
        
        fetchPizzasSoldData();
        
    });

    
    
    
    

    $('#storeSelection').change(function () {
        fetchStoreInfo();
        
    });

    fetchStoreInfo();
    fetchRevenueData();
    fetchPizzasSoldData();
    

});