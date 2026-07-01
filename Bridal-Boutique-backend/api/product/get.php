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

$category_id = intval($_GET['category_id'] ?? 0);
$company_id = intval($_GET['company_id'] ?? 0);
$limit = intval($_GET['limit'] ?? 0);

$query = "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.active_status=1";
if ($company_id > 0) {
    $query .= " AND p.company_id=$company_id";
}
if ($category_id > 0) {
    $query .= " AND p.category_id=$category_id";
}
$query .= " ORDER BY p.id DESC";
if ($limit > 0) {
    $query .= " LIMIT $limit";
}

$result = mysqli_query($conn, $query);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    if (empty($row['image_gallery_json'])) {
        $row['image_gallery_json'] = json_encode([]);
    }
    $data[] = $row;
}

echo json_encode(["status" => true, "data" => $data]);