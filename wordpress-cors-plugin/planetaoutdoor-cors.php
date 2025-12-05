<?php
/**
 * Plugin Name: Planeta Outdoor CORS
 * Description: Habilita CORS para la API de WooCommerce
 * Version: 1.0
 * Author: Planeta Outdoor
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Agregar headers CORS
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();

        // Dominios permitidos
        $allowed_origins = array(
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            'http://localhost:5179',
            'http://localhost:3000',
            'https://planetaoutdoor.cl',
            'https://www.planetaoutdoor.cl',
        );

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');

        return $value;
    });
}, 15);

// Manejar preflight OPTIONS
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();

        $allowed_origins = array(
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            'http://localhost:5179',
            'http://localhost:3000',
            'https://planetaoutdoor.cl',
            'https://www.planetaoutdoor.cl',
        );

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Max-Age: 86400');

        status_header(200);
        exit();
    }
});
