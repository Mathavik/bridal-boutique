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

function saveBase64Image($value)
{
    if (!$value) {
        return '';
    }

    // Already uploaded path
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

    $file_name = time() . "_" . uniqid() . ".png";
    $full_path = $upload_dir . $file_name;

    if (file_put_contents($full_path, $decoded) === false) {
        return "";
    }

    return "uploads/" . $file_name;
}

// Inputs
$name = trim($data['name'] ?? '');
$company_id = intval($data['company_id'] ?? 0);
$banner_image = saveBase64Image(trim($data['banner_image'] ?? ''));
$status = trim($data['status'] ?? 'active');

// Visible (true/false -> 1/0)
$visible = (!empty($data['visible']) && $data['visible'] == true) ? 1 : 0;

// Validate status
if (!in_array($status, ['active', 'inactive'])) {
    $status = 'active';
}

// Validation
if (!$name || !$company_id) {
    echo json_encode([
        "status" => false,
        "message" => "Name & Company required"
    ]);
    exit;
}

// Duplicate Check
$dup = mysqli_query(
    $conn,
    "SELECT id FROM categories
     WHERE name='$name'
     AND company_id='$company_id'
     AND is_deleted=0"
);

if (mysqli_num_rows($dup) > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Category already exists"
    ]);
    exit;
}

// Insert Category
$sql = "INSERT INTO categories
(
    name,
    company_id,
    banner_image,
    status,
    visible
)
VALUES
(
    '$name',
    '$company_id',
    '$banner_image',
    '$status',
    '$visible'
)";

if ($conn->query($sql)) {

    echo json_encode([
        "status" => true,
        "message" => "Category added successfully"
    ]);

} else {

    echo json_encode([
        "status" => false,
        "message" => $conn->error
    ]);

}

$conn->close();
?>