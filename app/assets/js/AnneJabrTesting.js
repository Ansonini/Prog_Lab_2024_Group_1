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
                    const data = response.data;
                    const labels = data.map(store => store.storeID);
                    const zipcodes = data.map(store => store.zipcode);
                    const states = data.map(store => store.stateAbbr);

                    const ctx = document.getElementById('storeChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Zipcode',
                                data: zipcodes,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }, {
                                label: 'State',
                                data: states,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                $('#loading').hide();
                alert('Error fetching data');
            }
        });
    }

    function updateTableHeader(view) {
        // No changes needed here for the chart
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
                    const data = response.data;
                    const labels = data.flatMap(item => item.data.map(entry => entry.period));
                    const revenues = data.flatMap(item => item.data.map(entry => entry.revenue));

                    const ctx = document.getElementById('additionalChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Revenue',
                                data: revenues,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
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
                    const data = response.data;
                    const labels = data.flatMap(item => item.data.map(entry => entry.period));
                    const totalPizzas = data.flatMap(item => item.data.map(entry => entry.totalPizzas));

                    const ctx = document.getElementById('pizzaSoldChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Total Pizzas',
                                data: totalPizzas,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
            }
        });
    }

    function updatePeriodTableHeader() {
        // No changes needed here for the chart
    }

    function fetchPeriodRevenueData() {
        var periodType = $('#periodView').val();
        var storeID = $('#storeDropdown').val();
        var periodValue = null;

        if (periodType === 'oneMonth') {
            periodValue = $('#month').val();
        } else if (periodType === 'threeMonths') {
            periodValue = $('#threeMonthsPeriod').val();
        } else if (periodType === 'sixMonths') {
            periodValue = $('#sixMonthsPeriod').val();
        }

        updatePeriodTableHeader();

        $.ajax({
            url: '/BackendTestingJabrail/periodenRevenuePerYears.php',
            type: 'POST',
            dataType: 'json',
            data: { storeID: storeID, periodType: periodType, periodValue: periodValue },
            success: function (response) {
                if (response.success) {
                    const data = response.data[0].data;
                    const labels = data.map(item => item.year);
                    const revenues = data.map(item => item.revenue);

                    const ctx = document.getElementById('periodRevenueChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Revenue',
                                data: revenues,
                                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching data');
            }
        });
    }

    $('#storeDropdown').change(function () {
        fetchStoreInfo();
        fetchRevenueData();
        fetchPizzasSoldData();
        fetchPeriodRevenueData();
    });

    $('#periodView').change(function () {
        var periodType = $(this).val();
        $('#monthSettings').hide();
        $('#threeMonthsSettings').hide();
        $('#sixMonthsSettings').hide();

        if (periodType === 'oneMonth') {
            $('#monthSettings').show();
        } else if (periodType === 'threeMonths') {
            $('#threeMonthsSettings').show();
        } else if (periodType === 'sixMonths') {
            $('#sixMonthsSettings').show();
        }
        fetchPeriodRevenueData();
    });

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
    fetchPeriodRevenueData();
});