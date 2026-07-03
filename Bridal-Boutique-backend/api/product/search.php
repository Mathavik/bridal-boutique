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

$q = trim($_GET['q'] ?? '');
$category_id = intval($_GET['category_id'] ?? 0);
$min_price = is_numeric($_GET['min_price'] ?? null) ? floatval($_GET['min_price']) : 0;
$max_price = is_numeric($_GET['max_price'] ?? null) ? floatval($_GET['max_price']) : 0;
$availability = trim($_GET['availability'] ?? '');
$limit = intval($_GET['limit'] ?? 0);

$query = "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.active_status=1 AND p.is_deleted=0";
$params = [];
$types = "";

if ($q !== '') {
    $query .= " AND (";
    $query .= "p.product_name LIKE ? OR c.name LIKE ? OR p.short_description LIKE ? OR p.full_description LIKE ? OR p.fabric LIKE ? OR p.color LIKE ? OR p.occasion LIKE ? OR p.embroidery LIKE ?";
    $query .= ")";

    $searchValue = "%{$q}%";
    for ($i = 0; $i < 8; $i++) {
        $params[] = $searchValue;
        $types .= 's';
    }
}

if ($category_id > 0) {
    $query .= " AND p.category_id = ?";
    $params[] = $category_id;
    $types .= 'i';
}

if ($min_price > 0) {
    $query .= " AND p.price >= ?";
    $params[] = $min_price;
    $types .= 'd';
}

if ($max_price > 0) {
    $query .= " AND p.price <= ?";
    $params[] = $max_price;
    $types .= 'd';
}

if ($availability === 'in_stock') {
    $query .= " AND p.stock > 0";
} elseif ($availability === 'out_of_stock') {
    $query .= " AND p.stock <= 0";
}

$query .= " ORDER BY p.id DESC";
if ($limit > 0) {
    $query .= " LIMIT ?";
    $params[] = $limit;
    $types .= 'i';
}

$stmt = mysqli_prepare($conn, $query);
if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Failed to prepare search query."]);
    exit;
}

if (!empty($params)) {
    $bindParams = [];
    $bindParams[] = &$types;
    for ($i = 0; $i < count($params); $i++) {
        $bindParams[] = &$params[$i];
    }

    call_user_func_array([$stmt, 'bind_param'], $bindParams);
}

$stmt->execute();
$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    if (empty($row['image_gallery_json'])) {
        $row['image_gallery_json'] = json_encode([]);
    }
    $data[] = $row;
}

echo json_encode(["status" => true, "data" => $data]);
