<?php
/**
 * Safe Database Handler with Zero-Crash Fallback
 * ResumeFlow AI 2.0
 */

class database
{
    public $link = null;
    public $isConnected = false;

    function __construct()
    {
        $this->connection();
    }

    function connection()
    {
        try {
            mysqli_report(MYSQLI_REPORT_OFF);
            $host = getenv('DB_HOST') ?: 'localhost';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';
            $db   = getenv('DB_NAME') ?: 'cv';

            $this->link = @new mysqli($host, $user, $pass, $db);
            if ($this->link && !$this->link->connect_error) {
                $this->isConnected = true;
            }
        } catch (Exception $e) {
            $this->isConnected = false;
        }
    }

    function query($q)
    {
        if (!$this->isConnected || !$this->link) {
            return false;
        }
        return @$this->link->query($q);
    }

    function get_query($q)
    {
        if (!$this->isConnected || !$this->link) {
            return false;
        }
        return @$this->link->query($q);
    }

    function fetch_query($q)
    {
        if (!$this->isConnected || !$this->link) {
            return [];
        }
        $res = @$this->link->query($q);
        if ($res && method_exists($res, 'fetch_assoc')) {
            return $res->fetch_assoc();
        }
        return [];
    }

    function userdata($id)
    {
        if (!$this->isConnected || !$this->link) {
            return [
                'id' => $id,
                'name' => 'User',
                'username' => 'user',
                'email' => 'user@example.com'
            ];
        }
        $result = $this->query("SELECT * FROM users WHERE id = '" . $this->link->real_escape_string($id) . "'");
        if ($result && method_exists($result, 'fetch_assoc')) {
            return $result->fetch_assoc();
        }
        return [
            'id' => $id,
            'name' => 'User',
            'username' => 'user',
            'email' => 'user@example.com'
        ];
    }
}

$database = new database();
?>
