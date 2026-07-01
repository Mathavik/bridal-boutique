<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../config/db.php';

$id = intval($_GET['id'] ?? 0);
if (!$id) {
    echo json_encode(["status" => false, "message" => "Product ID required"]);
    exit;
}

$result = mysqli_query($conn, "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id=$id");
$product = mysqli_fetch_assoc($result);

if (!$product) {
    echo json_encode(["status" => false, "message" => "Product not found"]);
    exit;
}

if (empty($product['image_gallery_json'])) {
    $product['image_gallery_json'] = json_encode([]);
}

echo json_encode(["status" => true, "data" => $product]);
?>