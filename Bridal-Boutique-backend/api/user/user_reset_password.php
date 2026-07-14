<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config/db.php";

// Allow token from query string (for GET) or from POST body
$token = $_GET['token'] ?? null;
if (!$token) {
    $data = json_decode(file_get_contents("php://input"), true);
    $token = $data['token'] ?? null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If token is present, we could validate and return a success message,
    // but for security we'll just return a generic message.
    if ($token) {
        // Optionally validate token existence and not expired, then show a form in frontend
        // For API-only, we just respond.
        echo json_encode(["status" => true, "message" => "Token provided. Send POST request to reset password."]);
    } else {
        echo json_encode(["status" => false, "message" => "Token is required"]);
    }
    exit;
}

// Process POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => false, "message" => "Method not allowed"]);
    exit;
}

// Get data from POST body
$data = json_decode(file_get_contents("php://input"), true);
$token = trim($data['token'] ?? '');
$password = trim($data['password'] ?? '');
$confirmPassword = trim($data['confirm_password'] ?? '');

if (!$token || !$password || !$confirmPassword) {
    echo json_encode(["status" => false, "message" => "Token, password, and confirm_password are required"]);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode(["status" => false, "message" => "Passwords do not match"]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["status" => false, "message" => "Password must be at least 6 characters"]);
    exit;
}

// Validate token
$tokenEscaped = mysqli_real_escape_string($conn, $token);
$resetQuery = mysqli_query($conn, "SELECT email, expiry FROM password_resets WHERE token='$tokenEscaped' LIMIT 1");
if (!$resetQuery || mysqli_num_rows($resetQuery) === 0) {
    echo json_encode(["status" => false, "message" => "Invalid or expired token"]);
    exit;
}

$resetRow = mysqli_fetch_assoc($resetQuery);
$email = $resetRow['email'];
$expiry = $resetRow['expiry'];

// Check expiry
if (strtotime($expiry) < time()) {
    // Delete expired token
    mysqli_query($conn, "DELETE FROM password_resets WHERE token='$tokenEscaped'");
    echo json_encode(["status" => false, "message" => "Token has expired"]);
    exit;
}

// Update user password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$update = mysqli_query($conn, "UPDATE frontend_users SET password='$hashedPassword' WHERE email='" . mysqli_real_escape_string($conn, $email) . "'");

if (!$update) {
    echo json_encode(["status" => false, "message" => "Failed to reset password: " . mysqli_error($conn)]);
    exit;
}

// Delete the used token
mysqli_query($conn, "DELETE FROM password_resets WHERE token='$tokenEscaped'");

echo json_encode(["status" => true, "message" => "Password has been reset successfully"]);
?>