<?php
//Start our session
session_start();
header("Access-Control-Allow-Origin: *");
//Require connection to the database
require('../connect.php');

//Catch the json object sent from our axios call and convert it into php readable code.
$userStats = json_decode(file_get_contents('php://input'), true);

//If user stats contains information, then process it.
if(!empty($userStats)) {

    //Get user id from the user session variable.
    $userId = $_SESSION["id"];

    //Pull activity score out of the axios object.
    $activityScore = $userStats['activity_score'];

    //Send user id and activity score to database to retrieve category id's that contain those criteria.
    if($activityScore || $activityScore === 0) {
        $requestQuery = "SELECT `activity_id` FROM `request_table` WHERE `user_id`=" . $userId . " AND `activity_score`=" . $activityScore . " ";
    }
    else{
        //If no heart rate data is found return all activities.
        $requestQuery = "SELECT `activity_id` FROM `request_table` WHERE `user_id`=" . $userId  . " ";
    }
    $requestResult = mysqli_query($conn, $requestQuery);
    while($requestRow = mysqli_fetch_assoc($requestResult)){
        $requestData[]=$requestRow;
    };

    //Send the results from the prior query to our database to retrieve the category id's associated with those
    //activities.
    $activityQuery = "SELECT `category_id`,`description` FROM `activity_table` WHERE ";
    if(count($requestData)>0) {
        for ($i = 0; $i < count($requestData); $i++) {
            if ($i === 0) {
                $activityQuery .= " `id`=" . $requestData[$i]['activity_id'] . " ";
            } else {
                $activityQuery .= " OR `id`=" . $requestData[$i]['activity_id'] . " ";
            }
        }
        $activityResult = mysqli_query($conn, $activityQuery);
        while ($activityRow = mysqli_fetch_assoc($activityResult)) {
            $activityData[] = $activityRow;
        };
        //Transform our new data back to json to send back to our JavaScript file.
        $activityData = json_encode($activityData);
        print_r($activityData);
    }
    else{
        echo"No Activity Data Found";
    }
}
