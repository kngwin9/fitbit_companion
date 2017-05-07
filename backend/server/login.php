<?php
//Start the users session.
session_start();

//Require connection to the database
require("../connect.php");
header("Access-Control-Allow-Origin: *");

//Catch the json object sent from our axios call and convert it into php readable code.
$userInfo = json_decode(file_get_contents('php://input'), true);

//If user info contains information, then process it.
if(isset($userInfo) && !empty($userInfo)){

    //Pull the username and password out of the axios object.
    $username = mysqli_real_escape_string($conn, $userInfo["username"]);
    $password = $userInfo["password"];

    //Select the user id from our main user table based on the username and password provided.
    $sql = "SELECT `id`,`password` FROM `user_table` WHERE `name`='$username'";
    $result = mysqli_query($conn, $sql);

    if($result->num_rows === 1){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        //If a row is returned set the id key in the Global Session variable to to the user id returned from our query.
        if(password_verify($password, $row["password"])){
            $_SESSION["id"] = $row["id"];
        }
        //If it fails return a 0 to the axios call.
        else{
            $fmsg = 0;
            echo $fmsg;
        }
    }
}

//If the session id is set send a success message.
if(isset($_SESSION["id"])){
    $smsg = 1;
    echo $smsg;
}