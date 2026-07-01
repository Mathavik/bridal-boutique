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

function saveBase64Image($value) {
    if (!$value) {
        return '';
    }
    if (!preg_match('/^[A-Za-z0-9+\/]+={0,2}$/', $value)) {
        return $value;
    }
    $decoded = base64_decode($value, true);
    if ($decoded === false) {
        return $value;
    }
    $upload_dir = __DIR__ . "/../uploads/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $file_name = time() . '_' . uniqid() . '.png';
    $full_path = $upload_dir . $file_name;
    if (file_put_contents($full_path, $decoded) === false) {
        return $value;
    }
    return "uploads/" . $file_name;
}

$id = intval($data['id'] ?? 0);
$name = trim($data['name'] ?? '');
$banner_image = saveBase64Image(trim($data['banner_image'] ?? ''));

if (!$id || !$name) {
    echo json_encode(["status"=>false,"message"=>"ID & Name required"]);
    exit;
}

$sql = "UPDATE categories SET name='$name', banner_image='$banner_image' WHERE id='$id'";

if ($conn->query($sql)) {
    echo json_encode(["status"=>true,"message"=>"Updated"]);
} else {
    echo json_encode(["status"=>false,"message"=>$conn->error]);
}
?>