<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$name || !$email || !$password) {
    echo json_encode(["status" => false, "message" => "Name, email and password are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => false, "message" => "Invalid email address"]);
    exit;
}

$check = mysqli_query($conn, "SELECT id FROM frontend_users WHERE email='" . mysqli_real_escape_string($conn, $email) . "' LIMIT 1");
if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode(["status" => false, "message" => "Email already registered"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO frontend_users (name, email, password, status, created_at) VALUES ('" . mysqli_real_escape_string($conn, $name) . "', '" . mysqli_real_escape_string($conn, $email) . "', '$hashed', 'active', NOW())";

if (mysqli_query($conn, $sql)) {
    $id = mysqli_insert_id($conn);
    echo json_encode(["status" => true, "message" => "Registration successful", "data" => ["id" => $id, "name" => $name, "email" => $email]]);
} else {
    echo json_encode(["status" => false, "message" => "Registration failed: " . mysqli_error($conn)]);
}
?>