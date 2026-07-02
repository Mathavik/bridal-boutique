<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$address = isset($data['address']) ? trim($data['address']) : '';

if ($user_id <= 0 || empty($name)) {
    echo json_encode([
        'status' => false,
        'message' => 'User ID and name are required'
    ]);
    exit;
}

try {
    $query = "UPDATE users 
              SET name = :name, 
                  phone = :phone, 
                  address = :address 
              WHERE id = :user_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':user_id', $user_id);
    
    if ($stmt->execute()) {
        // Get updated user data
        $getUserQuery = "SELECT id, name, email, phone, address, created_at, profile_image 
                         FROM users WHERE id = :user_id";
        $getStmt = $db->prepare($getUserQuery);
        $getStmt->bindParam(':user_id', $user_id);
        $getStmt->execute();
        $user = $getStmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    } else {
        echo json_encode([
            'status' => false,
            'message' => 'Failed to update profile'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => false,
        'message' => 'Error updating profile: ' . $e->getMessage()
    ]);
}
?>