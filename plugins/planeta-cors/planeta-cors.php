<?php
/**
 * Plugin Name: Planeta CORS
 * Plugin URI: https://planetaoutdoor.cl
 * Description: Habilita CORS para permitir peticiones desde franciscal58.sg-host.com a la API REST de WordPress y WooCommerce.
 * Version: 1.0.0
 * Author: Planeta Outdoor
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) {
    exit;
}

class Planeta_CORS {

    private $allowed_origins = array(
        'https://franciscal58.sg-host.com',
        'http://franciscal58.sg-host.com',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
    );

    public function __construct() {
        add_action('init', array($this, 'handle_preflight'), 1);
        add_action('rest_api_init', array($this, 'add_cors_headers'), 15);
        add_filter('rest_pre_serve_request', array($this, 'send_cors_headers'), 10, 4);
    }

    /**
     * Maneja las peticiones OPTIONS (preflight)
     */
    public function handle_preflight() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            $origin = $this->get_origin();

            if ($this->is_allowed_origin($origin)) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Max-Age: 86400');
                header('Content-Length: 0');
                header('Content-Type: text/plain');
                exit(0);
            }
        }
    }

    /**
     * Agrega headers CORS a la API REST
     */
    public function add_cors_headers() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    }

    /**
     * Envía headers CORS en las respuestas
     */
    public function send_cors_headers($served, $result, $request, $server) {
        $origin = $this->get_origin();

        if ($this->is_allowed_origin($origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
        }

        return $served;
    }

    /**
     * Obtiene el origen de la petición
     */
    private function get_origin() {
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            return $_SERVER['HTTP_ORIGIN'];
        }
        return '';
    }

    /**
     * Verifica si el origen está permitido
     */
    private function is_allowed_origin($origin) {
        return in_array($origin, $this->allowed_origins);
    }
}

// Inicializar el plugin
new Planeta_CORS();
