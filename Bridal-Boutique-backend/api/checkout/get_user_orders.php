<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include database connection
include __DIR__ . '/../../config/db.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode([
        'status' => false,
        'message' => 'Invalid user ID'
    ]);
    exit;
}

try {
    // Get orders for the user
    $query = "SELECT 
                o.id, 
                o.guest_id,
                o.customer_name,
                o.email,
                o.mobile,
                o.shipping_address,
                o.total,
                o.payment_status,
                o.created_at,
                o.status
              FROM orders o
              WHERE o.guest_id = 'user_$user_id'
              ORDER BY o.created_at DESC";
    
    $result = mysqli_query($conn, $query);
    
    if (!$result) {
        throw new Exception("Database error: " . mysqli_error($conn));
    }
    
    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Get order items
        $itemsQuery = "SELECT 
                        oi.product_id,
                        oi.product_name,
                        oi.quantity,
                        oi.price
                      FROM order_items oi
                      WHERE oi.order_id = " . $row['id'];
        
        $itemsResult = mysqli_query($conn, $itemsQuery);
        $items = [];
        
        while ($item = mysqli_fetch_assoc($itemsResult)) {
            // Get product image from products table
            $image = null;
            $imgQuery = "SELECT image, image_gallery_json FROM products WHERE id = " . $item['product_id'];
            $imgResult = mysqli_query($conn, $imgQuery);
            if ($imgData = mysqli_fetch_assoc($imgResult)) {
                // First try to get image from 'image' column
                if (!empty($imgData['image'])) {
                    $image = $imgData['image'];
                } 
                // If no image, try to get first image from gallery
                else if (!empty($imgData['image_gallery_json'])) {
                    $gallery = json_decode($imgData['image_gallery_json'], true);
                    $image = !empty($gallery) && is_array($gallery) ? $gallery[0] : null;
                }
            }
            
            $item['image'] = $image;
            $item['total'] = $item['price'] * $item['quantity'];
            $items[] = $item;
        }
        
        $row['items'] = $items;
        // Use status from database if available, otherwise default to 'pending'
        $row['status'] = !empty($row['status']) ? $row['status'] : 'pending';
        $orders[] = $row;
    }
    
    echo json_encode([
        'status' => true,
        'data' => $orders
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => false,
        'message' => 'Error fetching orders: ' . $e->getMessage()
    ]);
}
?>