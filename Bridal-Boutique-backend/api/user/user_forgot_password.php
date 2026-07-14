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

// Include PHPMailer
require '../../PHPMailer/src/Exception.php';
require '../../PHPMailer/src/PHPMailer.php';
require '../../PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    echo json_encode(["status" => false, "message" => "Email is required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => false, "message" => "Invalid email address"]);
    exit;
}

// Check if user exists
$userQuery = mysqli_query($conn, "SELECT id FROM frontend_users WHERE email='" . mysqli_real_escape_string($conn, $email) . "' LIMIT 1");
if (!$userQuery || mysqli_num_rows($userQuery) === 0) {
    // For security, return generic message
    echo json_encode(["status" => false, "message" => "If this email exists, a reset link has been sent"]);
    exit;
}

// Generate secure token
$token = bin2hex(random_bytes(32));
$expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store token in password_resets table (make sure this table exists)
$insert = mysqli_query($conn, "INSERT INTO password_resets (email, token, expiry) VALUES (
    '" . mysqli_real_escape_string($conn, $email) . "',
    '" . mysqli_real_escape_string($conn, $token) . "',
    '" . mysqli_real_escape_string($conn, $expiry) . "'
)");

if (!$insert) {
    echo json_encode(["status" => false, "message" => "Failed to generate reset link: " . mysqli_error($conn)]);
    exit;
}

// Build reset link – point to your React frontend reset page
$resetLink = "http://localhost:5174/reset-password?token=" . urlencode($token);
// ---------- Send email via PHPMailer ----------
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = 0;                      // 0 = no debug, 1 = errors, 2 = full
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';      // Use your SMTP server (e.g., smtp.gmail.com)
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mahalakshmivelu508@gmail.com'; // Your email address
    $mail->Password   = 'qmflzdlpledeclpm';    // Your app password (not regular password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('no-reply@yourdomain.com', 'Bridal Boutique');
    $mail->addAddress($email);                 // Add recipient

    // Content
    $mail->isHTML(false);                       // Set email format to plain text
    $mail->Subject = 'Password Reset Request';
    $mail->Body    = "Hello,\n\nYou requested a password reset. Click the link below to set a new password:\n\n$resetLink\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.";

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    // Log the error for debugging (but still return generic success for security)
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    $mailSent = false;
}

if ($mailSent) {
    echo json_encode(["status" => true, "message" => "If this email exists, a reset link has been sent"]);
} else {
    // Return generic success to avoid email enumeration
    echo json_encode(["status" => true, "message" => "If this email exists, a reset link has been sent"]);
}
?>