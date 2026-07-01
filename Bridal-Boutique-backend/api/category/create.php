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

$name = trim($data['name'] ?? '');
$company_id = intval($data['company_id'] ?? 0);
$banner_image = saveBase64Image(trim($data['banner_image'] ?? ''));

if (!$name || !$company_id) {
    echo json_encode(["status"=>false,"message"=>"Name & Company required"]);
    exit;
}

// Duplicate check
$dup = mysqli_query($conn, "SELECT id FROM categories 
WHERE name='$name' AND company_id='$company_id' AND is_deleted=0");

if (mysqli_num_rows($dup) > 0) {
    echo json_encode(["status"=>false,"message"=>"Category already exists"]);
    exit;
}

$sql = "INSERT INTO categories (name, company_id, banner_image)
VALUES ('$name','$company_id','$banner_image')";

if ($conn->query($sql)) {
    echo json_encode(["status"=>true,"message"=>"Category added"]);
} else {
    echo json_encode(["status"=>false,"message"=>$conn->error]);
}
?>