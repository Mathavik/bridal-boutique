<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include __DIR__ . '/../../config/db.php';

$invoice_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($invoice_id <= 0) {
    echo json_encode([
        'status' => false,
        'message' => 'Invalid invoice ID'
    ]);
    exit;
}

try {
    // First try to find by invoice_id directly
    $query = "SELECT 
                i.*
              FROM invoices i
              WHERE i.id = $invoice_id";
    
    $result = mysqli_query($conn, $query);
    
    // If not found, try to find by order_id (invoice_id is actually order_id)
    if (!$result || mysqli_num_rows($result) == 0) {
        // Try to find order with this ID
        $orderQuery = "SELECT 
                        o.id as order_id,
                        o.customer_name,
                        o.email,
                        o.mobile,
                        o.shipping_address,
                        o.total,
                        o.payment_status,
                        o.created_at,
                        o.status,
                        o.invoice_id
                      FROM orders o
                      WHERE o.id = $invoice_id";
        
        $orderResult = mysqli_query($conn, $orderQuery);
        
        if ($orderResult && mysqli_num_rows($orderResult) > 0) {
            $order = mysqli_fetch_assoc($orderResult);
            
            // If order has invoice_id, use that
            if (!empty($order['invoice_id'])) {
                $invQuery = "SELECT * FROM invoices WHERE id = " . $order['invoice_id'];
                $invResult = mysqli_query($conn, $invQuery);
                if ($invResult && mysqli_num_rows($invResult) > 0) {
                    $invoice = mysqli_fetch_assoc($invResult);
                } else {
                    // Create response from order data
                    $itemsQuery = "SELECT * FROM order_items WHERE order_id = " . $order['order_id'];
                    $itemsResult = mysqli_query($conn, $itemsQuery);
                    $items = [];
                    while ($item = mysqli_fetch_assoc($itemsResult)) {
                        $items[] = $item;
                    }
                    
                    echo json_encode([
                        'status' => true,
                        'data' => [
                            'id' => $order['order_id'],
                            'invoice_no' => 'ORD-' . $order['order_id'],
                            'customer_name' => $order['customer_name'],
                            'customer_phone' => $order['mobile'],
                            'email' => $order['email'],
                            'shipping_address' => $order['shipping_address'],
                            'items' => $items,
                            'sub_total' => $order['total'],
                            'gst_total' => 0,
                            'total_amount' => $order['total'],
                            'paid_amount' => 0,
                            'balance_amount' => $order['total'],
                            'payment_method' => 'cash',
                            'payment_status' => $order['payment_status'],
                            'created_at' => $order['created_at'],
                        ]
                    ]);
                    exit;
                }
            } else {
                // No invoice found, create response from order
                $itemsQuery = "SELECT * FROM order_items WHERE order_id = " . $order['order_id'];
                $itemsResult = mysqli_query($conn, $itemsQuery);
                $items = [];
                while ($item = mysqli_fetch_assoc($itemsResult)) {
                    $items[] = $item;
                }
                
                echo json_encode([
                    'status' => true,
                    'data' => [
                        'id' => $order['order_id'],
                        'invoice_no' => 'ORD-' . $order['order_id'],
                        'customer_name' => $order['customer_name'],
                        'customer_phone' => $order['mobile'],
                        'email' => $order['email'],
                        'shipping_address' => $order['shipping_address'],
                        'items' => $items,
                        'sub_total' => $order['total'],
                        'gst_total' => 0,
                        'total_amount' => $order['total'],
                        'paid_amount' => 0,
                        'balance_amount' => $order['total'],
                        'payment_method' => 'cash',
                        'payment_status' => $order['payment_status'],
                        'created_at' => $order['created_at'],
                    ]
                ]);
                exit;
            }
        } else {
            echo json_encode([
                'status' => false,
                'message' => 'Invoice not found'
            ]);
            exit;
        }
    } else {
        $invoice = mysqli_fetch_assoc($result);
    }
    
    // Parse products JSON
    $products = json_decode($invoice['products'], true);
    $invoice['items'] = $products ?: [];
    unset($invoice['products']);
    
    // Get order details for this invoice
    $orderQuery = "SELECT 
                    o.id as order_id,
                    o.shipping_address,
                    o.mobile,
                    o.email
                  FROM orders o
                  WHERE o.invoice_id = " . $invoice['id'] . "
                  ORDER BY o.id DESC
                  LIMIT 1";
    
    $orderResult = mysqli_query($conn, $orderQuery);
    if ($orderResult && mysqli_num_rows($orderResult) > 0) {
        $order = mysqli_fetch_assoc($orderResult);
        $invoice['shipping_address'] = $order['shipping_address'] ?? '';
        $invoice['mobile'] = $order['mobile'] ?? '';
        $invoice['email'] = $order['email'] ?? '';
    }
    
    // Get payment details
    $payQuery = "SELECT 
                    p.id as payment_id,
                    p.paid_amount,
                    p.balance_amount,
                    p.payment_method,
                    p.payment_status,
                    p.created_at as payment_date
                  FROM payments p
                  WHERE p.invoice_id = " . $invoice['id'] . "
                  ORDER BY p.id DESC
                  LIMIT 1";
    
    $payResult = mysqli_query($conn, $payQuery);
    if ($payResult && mysqli_num_rows($payResult) > 0) {
        $payment = mysqli_fetch_assoc($payResult);
        $invoice['payment_id'] = $payment['payment_id'];
        $invoice['payment_date'] = $payment['payment_date'];
    }
    
    $response = [
        'id' => $invoice['id'],
        'invoice_no' => $invoice['invoice_no'],
        'customer_id' => $invoice['customer_id'],
        'customer_name' => $invoice['customer_name'],
        'customer_phone' => $invoice['customer_phone'],
        'email' => $invoice['email'] ?? '',
        'mobile' => $invoice['mobile'] ?? '',
        'shipping_address' => $invoice['shipping_address'] ?? '',
        'items' => $invoice['items'],
        'sub_total' => $invoice['sub_total'],
        'gst_total' => $invoice['gst_total'],
        'total_amount' => $invoice['total_amount'],
        'paid_amount' => $invoice['paid_amount'] ?? 0,
        'balance_amount' => $invoice['balance_amount'] ?? 0,
        'payment_method' => $invoice['payment_method'],
        'payment_type' => $invoice['payment_type'],
        'payment_status' => $invoice['payment_status'],
        'gst_type' => $invoice['gst_type'],
        'gst_no' => $invoice['gst_no'],
        'created_at' => $invoice['created_at'],
        'due_date' => $invoice['due_date'],
    ];
    
    echo json_encode([
        'status' => true,
        'data' => $response
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => false,
        'message' => 'Error fetching invoice: ' . $e->getMessage()
    ]);
}
?>