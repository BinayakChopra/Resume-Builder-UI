<?php
session_start();

// Fetch incoming data
$cvData = $_REQUEST['data'];
$cvName = $_REQUEST['name'] ?: "No Name"; // Default to "No Name" if blank
$cvStyle = $_REQUEST['style'];
$theme = $_POST["theme"];
$oldname = $_REQUEST["file_old"];

// Wrap the resume data in HTML
$cvData = "<body><div class='cover'><div id='get'>{$cvData}</div></div></body>";
$cv = "<html><head id='styleback'>{$cvStyle}</head>{$cvData}</html>";

// Save the HTML into a file inside 'allcv/'
$filePath = "allcv/" . $oldname;
file_put_contents($filePath, $cv);  // Replaces fopen/fwrite/fclose

// Set the correct timezone
date_default_timezone_set("Asia/Kolkata");
$new_time = date("y-m-j G-i-s");

// ✅ DATABASE CONNECTION SETUP — You can move this into a config.php
$host = "localhost";
$username = "root";
$password = "";
$database = "cv";

$conn = new mysqli($host, $username, $password, $database);

// If DB connection fails
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Save/Update resume record in database
$userId = $_SESSION["userId"];
$sql = "UPDATE allcv SET 
            cvName = '$cvName', 
            cvFileName = '$oldname', 
            userId = '$userId', 
            theme = '$theme', 
            date = '$new_time' 
        WHERE cvFileName = '$oldname'";

$success = $conn->query($sql);

// Output the result
if ($success) {
    echo $oldname;
} else {
    echo "Failed to save resume!";
}
?>
