<?php
header('Content-Type: application/json');

// File to verify and set the input of ajax request for the dashboard

// Check if parameters are set
if (isset($_POST['view'])) {

    if ($_POST['view'] === 'completeView' || $_POST['view'] === 'yearView' || $_POST['view'] === 'monthView' || $_POST['view'] === 'weekView') {
        $view = $_POST['view'];
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid view selected']);
        exit;
    }

    if (isset($_POST['mode'])) {

        // Sanitize input to make sure the input is good
        if ($_POST['mode'] === 'units' || $_POST['mode'] === 'revenue') {
            $mode = $_POST['mode'];
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid mode']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing mode']);
        exit;
    }

    if ($view !== 'completeView') {
        if (isset($_POST['year'])) {
            $year = intval($_POST['year']);
            // Validate input
            if ($year <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid year']);
                exit;
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing year']);
            exit;
        }

        if ($view === 'monthView') {
            if (isset($_POST['month'])) {
                $month = intval($_POST['month']);
                if ($month <= 0) {
                    echo json_encode(['success' => false, 'message' => 'Invalid month']);
                    exit;
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Missing month']);
                exit;
            }
        } elseif ($view === 'weekView') {
            if (isset($_POST['week'])) {
                $week = intval($_POST['week']);
                if ($week <= 0) {
                    echo json_encode(['success' => false, 'message' => 'Invalid week']);
                    exit;
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Missing week']);
                exit;
            }
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing view']);
    exit;
}
