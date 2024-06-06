<?php

// include the DB connect file. ../ because its outside of this folder
global $conn;

// get sales numbers for specific year and week 
function getSalesFromWeek($year, $week)
{
  global $conn;

  $sql =
    "SELECT COUNT(oi.SKU)        as soldPizzas,
            YEAR(o.orderDate)    as sellingYear,
            week(o.orderDate, 1) as sellingWeek,
            DAYNAME(o.orderDate) as sellingDay
    FROM products p
          JOIN orderItems oi on oi.SKU = p.SKU
          JOIN orders o on o.orderID = oi.orderID
    WHERE YEAR(o.orderDate) = $year
    AND WEEK(o.orderDate, 1) = $week
    GROUP BY sellingYear, sellingWeek, weekday(o.orderDate), sellingDay
    ORDER BY sellingYear, sellingweek, weekday(o.orderDate)";

  $result = $conn->query($sql);

  $data = array();
  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
  } else {
    $data[] = "0 results";
  }
  $conn->close();

  return json_encode($data);
}
