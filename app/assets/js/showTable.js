// showTable.js

function displayJsonTable(data, tableContainerId) {
    if (!data || data.length === 0) {
        document.getElementById(tableContainerId).innerHTML = '<p>No data available</p>';
        return;
    }

    let tableHtml = '<table>';
    tableHtml += '<tr>';

    // Generate table headers based on keys of the first row
    const headers = Object.keys(data[0]);
    headers.forEach(key => {
        tableHtml += '<th>' + key + '</th>';
    });
    tableHtml += '</tr>';

    // Generate table rows
    data.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach(key => {
            tableHtml += '<td>' + row[key] + '</td>';
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</table>';

    document.getElementById(tableContainerId).innerHTML = tableHtml;
}
