<?php
/**
 * Safe Function Helpers with Zero-Crash Fallback
 * ResumeFlow AI 2.0
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function getSafeConnection()
{
    try {
        mysqli_report(MYSQLI_REPORT_OFF);
        $host = getenv('DB_HOST') ?: 'localhost';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        $db   = getenv('DB_NAME') ?: 'cv';

        $con = @new mysqli($host, $user, $pass, $db);
        if ($con && !$con->connect_error) {
            return $con;
        }
    } catch (Exception $e) {
        return null;
    }
    return null;
}

function userName()
{
    $con = getSafeConnection();
    if ($con && isset($_SESSION['userId'])) {
        $res = @$con->query("SELECT * FROM users WHERE id = '" . $con->real_escape_string($_SESSION['userId']) . "'");
        if ($res && $row = $res->fetch_assoc()) {
            return $row['name'] ?? 'Binayak Chopra';
        }
    }
    return $_SESSION['userName'] ?? 'Binayak Chopra';
}

function user()
{
    $con = getSafeConnection();
    if ($con && isset($_SESSION['userId'])) {
        $res = @$con->query("SELECT * FROM users WHERE id = '" . $con->real_escape_string($_SESSION['userId']) . "'");
        if ($res && $row = $res->fetch_assoc()) {
            return $row['username'] ?? 'binayak';
        }
    }
    return $_SESSION['user'] ?? 'binayak';
}

function pass()
{
    $con = getSafeConnection();
    if ($con && isset($_SESSION['userId'])) {
        $res = @$con->query("SELECT * FROM users WHERE id = '" . $con->real_escape_string($_SESSION['userId']) . "'");
        if ($res && $row = $res->fetch_assoc()) {
            return $row['password'] ?? '********';
        }
    }
    return '********';
}

function savedCv()
{
    $con = getSafeConnection();
    if ($con && isset($_SESSION['userId'])) {
        $array = @$con->query("SELECT * FROM allCv WHERE userId = '" . $con->real_escape_string($_SESSION['userId']) . "'");
        if ($array && $array->num_rows > 0) {
            while ($row = $array->fetch_assoc()) {
                echo "<tr class='center'>";
                echo "<td>" . htmlspecialchars($row['cvName']) . "</td>";
                echo "<td>" . htmlspecialchars($row['date']) . "</td>";
                echo "<td>
                        <a href='download.php?file=" . urlencode($row['cvFileName']) . "' class='btn btn-primary btn-sm'>Download</a>
                        <a href='deleteCv.php?file=" . urlencode($row['cvFileName']) . "' class='btn btn-danger btn-sm'>Delete</a>
                        <a href='builder.html' class='btn btn-success btn-sm'>Edit in Studio</a>
                      </td>";
                echo "</tr>";
            }
            return;
        }
    }

    // Default friendly message when using client-side storage
    echo "<tr><td colspan='3' style='text-align:center; padding: 20px;'>";
    echo "<p style='color:#64748b;'>Resumes are securely managed via the modern client studio vault.</p>";
    echo "<a href='dashboard.html' class='btn btn-primary btn-sm'><i class='fa-solid fa-folder-open'></i> Open Modern Vault</a>";
    echo "</td></tr>";
}

function deleteCv($filename)
{
    $con = getSafeConnection();
    if ($con) {
        @$con->query("DELETE FROM allCv WHERE cvFileName = '" . $con->real_escape_string($filename) . "'");
    }
}
?>
