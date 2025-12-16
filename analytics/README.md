# Configuración de Analytics - Planeta Outdoor

Este directorio contiene la configuración de Google Tag Manager para Planeta Outdoor.

## Credenciales

- **Google Analytics 4**: `G-LSDW0CLYH3`
- **Google Tag Manager**: `GTM-W4592JCN`
- **Meta Pixel**: `833280669483577`

## Instrucciones de Importación

### 1. Importar a Google Tag Manager

1. Ve a [Google Tag Manager](https://tagmanager.google.com/)
2. Selecciona el contenedor `GTM-W4592JCN`
3. Ve a **Admin** → **Import Container**
4. Sube el archivo `marketing.json`
5. Selecciona **Merge** → **Overwrite conflicting tags, triggers, and variables**
6. Confirma la importación

### 2. Verificar la Configuración

Después de importar, verifica que se crearon:

#### Tags (Etiquetas)
- ✅ GA4 Config
- ✅ Meta Pixel - Base Code
- ✅ GA4 - Page View
- ✅ GA4 - View Item
- ✅ Meta Pixel - ViewContent
- ✅ GA4 - Add to Cart
- ✅ Meta Pixel - AddToCart
- ✅ GA4 - Begin Checkout
- ✅ Meta Pixel - InitiateCheckout
- ✅ GA4 - Purchase
- ✅ Meta Pixel - Purchase
- ✅ GA4 - WhatsApp Click
- ✅ Meta Pixel - Contact (WhatsApp)
- ✅ GA4 - Phone Click
- ✅ Meta Pixel - Contact (Phone)
- ✅ GA4 - Contact Submit
- ✅ Meta Pixel - Lead (Contact Form)
- ✅ GA4 - Configurator Start
- ✅ GA4 - Configurator Complete
- ✅ Meta Pixel - Lead (Configurator)
- ✅ GA4 - View Item List

#### Triggers (Disparadores)
- ✅ All Pages
- ✅ CE - Page View
- ✅ CE - View Content
- ✅ CE - View Item List
- ✅ CE - Add to Cart
- ✅ CE - Begin Checkout
- ✅ CE - Initiate Checkout
- ✅ CE - Purchase
- ✅ CE - WhatsApp Click
- ✅ CE - Phone Click
- ✅ CE - Contact Submit
- ✅ CE - Configurator Start
- ✅ CE - Configurator Complete

#### Variables (Variables)
- ✅ GA4 Measurement ID
- ✅ Meta Pixel ID
- ✅ DL - Event ID
- ✅ DL - Product ID
- ✅ DL - Product Name
- ✅ DL - Product Category
- ✅ DL - Product IDs
- ✅ DL - Value
- ✅ DL - Currency
- ✅ DL - Num Items
- ✅ DL - Click Location
- ✅ DL - Service Interested
- ✅ DL - Form Name
- ✅ DL - Page Path
- ✅ DL - Page Title
- ✅ DL - Page Type
- ✅ DL - Configurator Profile
- ✅ DL - Configurator Location

### 3. Publicar el Contenedor

1. En GTM, haz clic en **Submit** (arriba a la derecha)
2. Agrega un nombre de versión (ej: "v1.0 - Initial Setup")
3. Agrega una descripción
4. Haz clic en **Publish**

### 4. Instalar GTM en el Sitio

Agrega este código en el `<head>` de tu aplicación (antes de cualquier otro script):

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W4592JCN');</script>
<!-- End Google Tag Manager -->
```

Y este código inmediatamente después de la etiqueta `<body>`:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W4592JCN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## Eventos que se Trackearon

### E-commerce
- `page_view` - Vista de página
- `view_item` - Ver producto individual
- `view_item_list` - Ver listado de productos
- `add_to_cart` - Agregar al carrito
- `begin_checkout` - Iniciar checkout (GA4)
- `initiate_checkout` - Iniciar checkout (Meta)
- `purchase` - Compra completada

### Conversiones
- `whatsapp_click` - Click en WhatsApp
- `phone_click` - Click en teléfono
- `contact_submit` - Envío de formulario de contacto

### Configurador (Arma tu Kit)
- `configurator_start` - Inicio del configurador
- `configurator_complete` - Configurador completado

## Testing

### Modo Preview
1. En GTM, haz clic en **Preview**
2. Ingresa la URL de tu sitio local: `http://localhost:5173`
3. Navega por el sitio y verifica que los eventos se disparen correctamente

### Google Tag Assistant
1. Instala la extensión [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visita tu sitio
3. Verifica que GTM, GA4 y Meta Pixel estén funcionando

## Meta Pixel Verificación

1. Ve a [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Selecciona tu Pixel ID: `833280669483577`
3. Ve a **Test Events**
4. Navega por tu sitio y verifica que los eventos lleguen en tiempo real

## Notas Importantes

- ⚠️ El hook de analytics (`useAnalytics.ts`) YA ESTÁ enviando los eventos al dataLayer
- ⚠️ GTM escucha esos eventos y los reenvía a GA4 y Meta Pixel
- ⚠️ NO necesitas agregar código adicional de tracking, solo instalar GTM
- ⚠️ Asegúrate de que el hook esté implementado en todas las páginas

## Soporte

Si tienes problemas con la configuración:
1. Verifica que GTM esté instalado correctamente en el sitio
2. Usa el modo Preview de GTM para debuggear
3. Revisa la consola del navegador para errores
4. Verifica que el dataLayer esté recibiendo los eventos correctamente
