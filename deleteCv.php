<?php
require 'assets/function.php';

// Sanitize the filename to avoid directory traversal attacks
$fileName = basename($_REQUEST['file']);
$filePath = "allcv/" . $fileName;

// Delete from database using your function
deleteCv($fileName);

// Delete file from server if it exists
if (file_exists($filePath)) {
    unlink($filePath);
}

// Redirect back to saved CVs page
header('Location: savedCv.php');
exit();
?>
