<?php
/**
 * Transbank Webpay Plus - Crear Transacción
 * Endpoint: POST /api/transbank/create.php
 */

// Headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Credenciales Transbank PRODUCCIÓN
$TBK_API_KEY_ID = '597032452310';
$TBK_API_KEY_SECRET = '810921a4-0217-4386-be76-d39514b2c0ed';
$TBK_API_URL = 'https://webpay3g.transbank.cl';

// Leer body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Validar campos requeridos
$requiredFields = ['buy_order', 'session_id', 'amount', 'return_url'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Preparar datos para Transbank
$transactionData = [
    'buy_order' => substr($data['buy_order'], 0, 26),
    'session_id' => substr($data['session_id'], 0, 61),
    'amount' => (int) $data['amount'],
    'return_url' => $data['return_url']
];

// Llamar a Transbank API
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $TBK_API_URL . '/rswebpaytransaction/api/webpay/v1.2/transactions',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($transactionData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Tbk-Api-Key-Id: ' . $TBK_API_KEY_ID,
        'Tbk-Api-Key-Secret: ' . $TBK_API_KEY_SECRET,
    ],
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$error = curl_error($curl);

curl_close($curl);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection error: ' . $error]);
    exit();
}

// Log para debug (opcional, remover en producción)
error_log("Transbank Create Response: " . $response);

http_response_code($httpCode);
echo $response;
