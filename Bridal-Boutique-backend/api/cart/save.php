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
$product_id = intval($data['product_id'] ?? 0);
$quantity = intval($data['quantity'] ?? 1);
$price = floatval($data['price'] ?? 0);

if (!$guest_id || !$product_id) {
    echo json_encode(["status" => false, "message" => "Guest ID and product are required"]);
    exit;
}

$existing = mysqli_query($conn, "SELECT id, quantity FROM cart WHERE guest_id='$guest_id' AND product_id=$product_id");
if (mysqli_num_rows($existing) > 0) {
    $row = mysqli_fetch_assoc($existing);
    mysqli_query($conn, "UPDATE cart SET quantity=quantity+$quantity, price=$price, updated_at=NOW() WHERE id={$row['id']}");
} else {
    mysqli_query($conn, "INSERT INTO cart (guest_id, product_id, quantity, price) VALUES ('$guest_id', $product_id, $quantity, $price)");
}

echo json_encode(["status" => true, "message" => "Cart updated"]);
?>