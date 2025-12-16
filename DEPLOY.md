# Instrucciones de Despliegue - Planeta Outdoor

## Requisitos Previos

1. WordPress + WooCommerce instalado en https://planetaoutdoor.cl
2. API Keys de WooCommerce configuradas
3. Acceso FTP/SFTP o File Manager de Neothek

## Estructura del Proyecto

```
planetaoutdoor.cl/
├── wp-admin/           # WordPress Admin (existente)
├── wp-content/         # WordPress Content (existente)
├── wp-includes/        # WordPress Core (existente)
├── wp-json/            # WooCommerce API (existente)
├── assets/             # React assets (subir desde dist/)
├── images/             # Imagenes estaticas (subir desde dist/)
├── index.html          # React SPA entry (subir desde dist/)
├── .htaccess           # Configuracion Apache (subir desde dist/)
├── robots.txt          # SEO (subir desde dist/)
├── sitemap.xml         # SEO (subir desde dist/)
└── logo.webp           # Logo (subir desde dist/)
```

## Pasos para Desplegar

### 1. Generar Build de Produccion

```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos optimizados.

### 2. Subir Archivos al Servidor

Conectate via FTP/SFTP a Neothek y sube el contenido de `dist/` a `public_html/`:

**Archivos a subir:**
- `index.html` -> `public_html/index.html`
- `assets/` -> `public_html/assets/`
- `images/` -> `public_html/images/`
- `.htaccess` -> `public_html/.htaccess`
- `robots.txt` -> `public_html/robots.txt`
- `sitemap.xml` -> `public_html/sitemap.xml`
- `logo.webp` -> `public_html/logo.webp`

**IMPORTANTE:** El .htaccess de React debe reemplazar el de WordPress solo en la raiz.
WordPress/WooCommerce seguira funcionando porque el .htaccess permite acceso a:
- `/wp-admin/`
- `/wp-json/`
- `/wp-content/`
- `/wp-includes/`
- `/wp-login.php`

### 3. Configuracion de WooCommerce

En WordPress Admin > WooCommerce > Settings > Advanced > REST API:

1. Verificar que las API Keys esten activas
2. Consumer Key: `ck_14978a0dbb9a4abf3fb9a286cfdc2ed6f6e7f3be`
3. Los permisos deben ser "Read/Write"

### 4. Configurar CORS en WordPress (si es necesario)

Agregar en `wp-config.php`:

```php
// Permitir CORS para la API
header("Access-Control-Allow-Origin: https://planetaoutdoor.cl");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```

O instalar el plugin "WP CORS" desde WordPress.

### 5. Verificacion Post-Despliegue

1. Visitar https://planetaoutdoor.cl - Debe cargar React SPA
2. Visitar https://planetaoutdoor.cl/wp-admin - Debe cargar WordPress Admin
3. Verificar que la tienda cargue productos
4. Probar el carrito y checkout
5. Verificar https://planetaoutdoor.cl/sitemap.xml
6. Verificar https://planetaoutdoor.cl/robots.txt

### 6. SSL/HTTPS

Neothek provee SSL gratuito con Let's Encrypt:
1. Panel de Neothek > SSL/TLS
2. Activar certificado para planetaoutdoor.cl
3. Forzar HTTPS (ya configurado en .htaccess)

## Comandos Utiles

```bash
# Build de produccion
npm run build

# Preview local del build
npm run preview

# Desarrollo local
npm run dev
```

## Solucion de Problemas

### Error 500 Internal Server Error
- Verificar permisos del .htaccess (644)
- Verificar que mod_rewrite este habilitado

### Paginas en blanco
- Verificar que el .htaccess tenga las reglas de SPA
- Limpiar cache del navegador

### API no responde
- Verificar API Keys de WooCommerce
- Verificar que CORS este configurado
- Verificar HTTPS en ambos lados

### Imagenes no cargan
- Verificar rutas relativas vs absolutas
- Verificar permisos de carpeta images/

## Contacto

Para soporte tecnico de Neothek: soporte@neothek.com
