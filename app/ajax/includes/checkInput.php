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

    if (isset($_POST['perSize'])) {

        // Sanitize input to make sure the input is good
        if ($_POST['perSize'] == true || $_POST['perSize'] == false) {
            $perSize = $_POST['perSize'];
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid perSize, needs to be true or false']);
            exit;
        }
    } else {
        $perSize = false;
    }


    if (isset($_POST['rankingSize'])) {

        // Sanitize input to make sure the input is good
        if (is_numeric($_POST['rankingSize']) && (int)$_POST['rankingSize'] == $_POST['rankingSize']) {
            $rankingSize = (int)$_POST['rankingSize'];
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid rankingSize, needs to be an integer']);
            exit;
        }
    } else {
        $rankingSize = 10;
    }


    // if we ever do floating timeframe

    // if (isset($_POST['timeframeType'])) {
    //     if ($_POST['timeframeType'] === 'fixed' || $_POST['timeframeType'] === 'floating') {
    //         $timeframeType = $_POST['timeframeType'];
    //     } else {
    //         echo json_encode(['success' => false, 'message' => 'Invalid timeframeType']);
    //         exit;
    //     }
    // } else {
    //     //echo json_encode(['success' => false, 'message' => 'Missing timeframeType']);
    //     //exit;
    //     // for now to avoid error messages
    //     $timeframeType = 'fixed';
    // }
    // if ($timeframeType === 'floating') {
    //     if (isset($_POST['startDate']) || isset($_POST['endDate'])) {
    //         $startDate = $_POST['startDate'];
    //         $endDate = $_POST['endDate'];
    //     } else {
    //         echo json_encode(['success' => false, 'message' => 'Missing start or end date']);
    //         exit;
    //     }
    // }


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
