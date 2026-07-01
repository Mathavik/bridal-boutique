<?php
// 🔥 CORS HEADERS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// 🔥 PREFLIGHT
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id'] ?? 0);
$name = trim($data['product_name'] ?? '');
$product_code = trim($data['product_code'] ?? '');
$category_id = intval($data['category_id'] ?? 0);
$price = floatval($data['price'] ?? 0);
$stock = intval($data['stock'] ?? 0);
$barcode = $data['barcode'] ?? '';
$unit = $data['unit'] ?? 'piece';
$gst = floatval($data['gst_percentage'] ?? 0);
$company_id = intval($data['company_id'] ?? 0);
$short_description = $conn->real_escape_string(trim($data['short_description'] ?? ''));
$full_description = $conn->real_escape_string(trim($data['full_description'] ?? ''));
$fabric = $conn->real_escape_string(trim($data['fabric'] ?? ''));
$embroidery = $conn->real_escape_string(trim($data['embroidery'] ?? ''));
$color = $conn->real_escape_string(trim($data['color'] ?? ''));
$available_sizes = $conn->real_escape_string(trim($data['available_sizes'] ?? ''));
$occasion = $conn->real_escape_string(trim($data['occasion'] ?? ''));

if (!$id || !$name || !$category_id || !$company_id) {
    echo json_encode(["status"=>false,"message"=>"Missing fields"]);
    exit;
}

// 🔥 VALIDATION AGAIN
$check = mysqli_query($conn, "SELECT id FROM categories 
WHERE id='$category_id' AND company_id='$company_id' AND is_deleted=0");

if (mysqli_num_rows($check) == 0) {
    echo json_encode(["status"=>false,"message"=>"Invalid category/company"]);
    exit;
}

$sql = "UPDATE products SET
product_name='$name',
product_code='$product_code',
category_id='$category_id',
price='$price',
stock='$stock',
barcode='$barcode',
unit='$unit',
gst_percentage='$gst',
short_description='$short_description',
full_description='$full_description',
fabric='$fabric',
embroidery='$embroidery',
color='$color',
available_sizes='$available_sizes',
occasion='$occasion'
WHERE id='$id'";

if ($conn->query($sql)) {
    echo json_encode(["status"=>true,"message"=>"Updated"]);
} else {
    echo json_encode(["status"=>false,"message"=>$conn->error]);
}
?>