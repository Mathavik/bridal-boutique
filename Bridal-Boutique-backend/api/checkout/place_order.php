<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../config/db.php';
$data = json_decode(file_get_contents("php://input"), true) ?: [];
$guest_id = trim($data['guest_id'] ?? '');
$customer_name = trim($data['customer_name'] ?? '');
$email = trim($data['email'] ?? '');
$mobile = trim($data['mobile'] ?? '');
$shipping_address = trim($data['shipping_address'] ?? '');
$items = $data['items'] ?? [];
$total = floatval($data['total'] ?? 0);

if (!$guest_id || !$customer_name || !$email || !$items) {
    echo json_encode(["status" => false, "message" => "Missing required checkout fields"]);
    exit;
}

mysqli_query($conn, "INSERT INTO orders (guest_id, customer_name, email, mobile, shipping_address, total, payment_status) VALUES ('$guest_id', '$customer_name', '$email', '$mobile', '$shipping_address', $total, 'paid')");
$order_id = $conn->insert_id;

foreach ($items as $item) {
    $product_id = intval($item['product_id'] ?? 0);
    $product_name = $conn->real_escape_string(trim($item['product_name'] ?? ''));
    $price = floatval($item['price'] ?? 0);
    $qty = intval($item['quantity'] ?? 1);
    if ($product_id) {
        mysqli_query($conn, "INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($order_id, $product_id, '$product_name', $price, $qty)");
    }
}

mysqli_query($conn, "DELETE FROM cart WHERE guest_id='$guest_id'");

// Send order confirmation email
require_once __DIR__ . '/../../PHPMailer/src/Exception.php';
require_once __DIR__ . '/../../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../PHPMailer/src/SMTP.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);
    $mail->isMail();
    $mail->setFrom('no-reply@bridal-boutique.local', 'Bridal Boutique');
    $mail->addAddress($email, $customer_name);
    $mail->isHTML(true);
    $mail->Subject = 'Order Confirmed – Dispatch in 2 Days';
    $mail->Body = "<p>Dear " . htmlspecialchars($customer_name) . ",</p>" .
        "<p>Thank you for your purchase. Your order (#" . $order_id . ") has been confirmed.</p>" .
        "<p>We will dispatch your order within 2 days and send you another update once it ships.</p>" .
        "<p>Order total: ₹" . number_format($total, 2) . "</p>" .
        "<p>Shipping Address:<br>" . nl2br(htmlspecialchars($shipping_address)) . "</p>" .
        "<p>Regards,<br>Bridal Boutique Team</p>";
    $mail->send();
} catch (Exception $e) {
    // Email failure is not fatal for checkout
}

echo json_encode(["status" => true, "message" => "Order placed", "order_id" => $order_id]);
?>