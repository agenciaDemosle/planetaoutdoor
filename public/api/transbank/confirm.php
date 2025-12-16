<?php
/**
 * Transbank Webpay Plus - Confirmar Transacción
 * Endpoint: POST /api/transbank/confirm.php
 *
 * Este endpoint recibe el token después de que el usuario paga en Webpay
 * y confirma la transacción con Transbank
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

if (!$data || !isset($data['token'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing token']);
    exit();
}

$token = $data['token'];

// Confirmar transacción con Transbank (PUT request)
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $TBK_API_URL . '/rswebpaytransaction/api/webpay/v1.2/transactions/' . $token,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'PUT',
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

// Log para debug
error_log("Transbank Confirm Response: " . $response);

http_response_code($httpCode);
echo $response;
