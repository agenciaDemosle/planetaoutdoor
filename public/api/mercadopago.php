<?php
/**
 * Mercado Pago API Proxy
 * Este archivo debe estar en el servidor para manejar las llamadas a Mercado Pago de forma segura
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

// Access Token de Mercado Pago (producción)
$ACCESS_TOKEN = 'APP_USR-7306207158343641-121118-6072458423402fb4529f2fcac89491ca-86948293';

// Leer body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Crear preferencia en Mercado Pago
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.mercadopago.com/checkout/preferences',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $ACCESS_TOKEN,
    ],
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$error = curl_error($curl);

curl_close($curl);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . $error]);
    exit();
}

http_response_code($httpCode);
echo $response;
