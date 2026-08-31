<?php
session_start();
if (!isset($_SESSION['userId'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once 'database.php';
$name = filter_input(INPUT_POST, 'names', FILTER_SANITIZE_SPECIAL_CHARS);
$uname = filter_input(INPUT_POST, 'unames', FILTER_SANITIZE_SPECIAL_CHARS);
$pass = $_POST['passs'] ?? '';

if ($database->isConnected && $database->link) {
    $userId = (int)$_SESSION['userId'];
    $stmt = $database->link->prepare("UPDATE users SET username=?, password=?, name=? WHERE id=?");
    if ($stmt) {
        $hashed = password_hash($pass, PASSWORD_DEFAULT);
        $stmt->bind_param("sssi", $uname, $hashed, $name, $userId);
        $stmt->execute();
        $stmt->close();
    }
}

echo json_encode(['success' => true, 'message' => 'Profile updated securely.']);
?>
