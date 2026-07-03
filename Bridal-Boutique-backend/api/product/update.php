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

function saveBase64Upload($base64String, $uploadDirectory, $defaultExtension = 'png') {
    if (empty($base64String)) {
        return '';
    }

    if (preg_match('/^data:(.*?);base64,/', $base64String, $matches)) {
        $mimeType = $matches[1];
        $base64String = substr($base64String, strpos($base64String, ',') + 1);
    } else {
        $mimeType = '';
    }

    $data = base64_decode($base64String, true);
    if ($data === false) {
        return '';
    }

    $extension = $defaultExtension;
    if ($mimeType) {
        $parts = explode('/', $mimeType);
        if (count($parts) === 2) {
            $extension = preg_replace('/[^a-z0-9]/i', '', $parts[1]);
        }
    }

    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true);
    }

    $filename = time() . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
    $fullPath = rtrim($uploadDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;

    if (file_put_contents($fullPath, $data) === false) {
        return '';
    }

    return 'uploads/' . $filename;
}

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
$keywords = $conn->real_escape_string(trim($data['keywords'] ?? ''));
$image_base64 = trim($data['image'] ?? '');
$gallery_images = $data['gallery_images'] ?? [];
$video_file = $data['video_file'] ?? '';
$video_url = trim($data['video_url'] ?? '');

$image = '';
$image_gallery_json = '';
$video_path = '';

if (!empty($image_base64)) {
    $savedImage = saveBase64Upload($image_base64, __DIR__ . "/../uploads/", 'png');
    if ($savedImage) {
        $image = $conn->real_escape_string($savedImage);
    }
}

if (is_array($gallery_images) && count($gallery_images) > 0) {
    $gallery_paths = [];
    foreach ($gallery_images as $galleryItem) {
        $savedPath = saveBase64Upload($galleryItem, __DIR__ . "/../uploads/", 'png');
        if ($savedPath) {
            $gallery_paths[] = $savedPath;
        }
    }
    if (count($gallery_paths) > 0) {
        $image_gallery_json = $conn->real_escape_string(json_encode($gallery_paths));
    }
}

if (!empty($video_file)) {
    $savedVideo = saveBase64Upload($video_file, __DIR__ . "/../uploads/", 'mp4');
    if ($savedVideo) {
        $video_path = $conn->real_escape_string($savedVideo);
    }
}

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
occasion='$occasion'";

if ($image !== '') {
    $sql .= ", image='$image'";
}
if ($image_gallery_json !== '') {
    $sql .= ", image_gallery_json='$image_gallery_json'";
}
$sql .= ", keywords='$keywords'";
if ($video_path !== '') {
    $sql .= ", video_url='$video_path'";
} elseif ($video_url !== '') {
    $sql .= ", video_url='$video_url'";
}

$sql .= " WHERE id='$id'";

if ($conn->query($sql)) {
    echo json_encode(["status"=>true,"message"=>"Updated"]);
} else {
    echo json_encode(["status"=>false,"message"=>$conn->error]);
}
?>