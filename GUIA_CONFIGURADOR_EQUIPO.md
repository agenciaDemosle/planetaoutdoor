# Guía del Configurador de Equipo - Planeta Outdoor

## Descripción
El Configurador de Equipo es un quiz interactivo que ayuda a los clientes a encontrar el kit de pesca perfecto según su perfil. Al completar el quiz, se muestran productos recomendados que pueden agregar al carrito con un solo clic.

## Cómo funciona
1. El cliente hace clic en "Arma tu Kit" en el menú
2. Responde 5-6 preguntas sobre su experiencia, tipo de pesca, presupuesto, etc.
3. Recibe recomendaciones personalizadas de productos
4. Puede agregar todo el kit al carrito con un clic

---

## CONFIGURACIÓN DE PRODUCTOS

Para que el configurador funcione correctamente, necesitas completar los IDs de productos de WooCommerce en el archivo:
```
src/data/gearConfigurator.ts
```

### Perfiles de Kit disponibles:

| Perfil | Descripción | Rango de Precio |
|--------|-------------|-----------------|
| `beginner_entry` | Principiante - Entrada | $150.000 - $250.000 |
| `beginner_intermediate` | Principiante - Calidad | $250.000 - $450.000 |
| `intermediate_intermediate` | Intermedio - Upgrade | $250.000 - $450.000 |
| `intermediate_advanced` | Intermedio - Avanzado | $450.000 - $750.000 |
| `advanced_advanced` | Avanzado - Especializado | $450.000 - $750.000 |
| `advanced_premium` | Avanzado - Premium | +$750.000 |

---

## PLANTILLA PARA COMPLETAR

### Kit Principiante Entrada ($150k - $250k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |
| Leader/Tippet | _________________________ | _____ | $______ |
| Moscas | _________________________ | _____ | $______ |
| Accesorios | _________________________ | _____ | $______ |

**Explicación del kit (para mostrar al cliente):**
_____________________________________________________
_____________________________________________________

---

### Kit Principiante Calidad ($250k - $450k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |
| Leader/Tippet | _________________________ | _____ | $______ |
| Moscas | _________________________ | _____ | $______ |
| Accesorios | _________________________ | _____ | $______ |

**Explicación del kit:**
_____________________________________________________
_____________________________________________________

---

### Kit Intermedio Upgrade ($250k - $450k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |
| Leader/Tippet | _________________________ | _____ | $______ |

**Explicación del kit:**
_____________________________________________________
_____________________________________________________

---

### Kit Intermedio Avanzado ($450k - $750k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |
| Leader/Tippet | _________________________ | _____ | $______ |

**Explicación del kit:**
_____________________________________________________
_____________________________________________________

---

### Kit Avanzado Especializado ($450k - $750k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |

**Explicación del kit:**
_____________________________________________________
_____________________________________________________

---

### Kit Avanzado Premium (+$750k)

| Categoría | Producto Recomendado | ID WooCommerce | Precio |
|-----------|---------------------|----------------|--------|
| Caña | _________________________ | _____ | $______ |
| Carrete | _________________________ | _____ | $______ |
| Línea | _________________________ | _____ | $______ |
| Leader/Tippet | _________________________ | _____ | $______ |
| Moscas | _________________________ | _____ | $______ |

**Explicación del kit:**
_____________________________________________________
_____________________________________________________

---

## CÓMO OBTENER LOS IDs DE WOOCOMMERCE

1. Ve al panel de WordPress > WooCommerce > Productos
2. Busca el producto que quieres agregar
3. El ID aparece en la URL cuando editas el producto:
   `wp-admin/post.php?post=**1234**&action=edit`
   En este ejemplo, el ID es **1234**

---

## EJEMPLO DE CONFIGURACIÓN

En el archivo `src/data/gearConfigurator.ts`, busca el kit que quieres configurar y reemplaza los valores:

```typescript
'beginner_entry': {
  profile: 'Principiante - Equipo de Entrada',
  description: 'Kit completo para comenzar en la pesca con mosca',
  totalPrice: 219900,  // Actualizar con precio real
  savings: 25000,      // Descuento por comprar el kit completo
  explanation: 'Tu explicación personalizada aquí...',
  products: [
    {
      id: 1234,        // <-- REEMPLAZAR con ID real de WooCommerce
      name: 'Caña Echo Base 9\' #5',
      price: 89900,
      reason: 'Perfecta para aprender...',
      category: 'cana',
      priority: 1,
    },
    // ... más productos
  ],
}
```

---

## CATEGORÍAS DE PRODUCTOS

Cada producto debe tener una de estas categorías:
- `cana` - Cañas de pesca
- `carrete` - Carretes
- `linea` - Líneas de pesca
- `leader` - Leaders y Tippets
- `moscas` - Sets de moscas
- `accesorios` - Accesorios varios

## PRIORIDADES

- `1` = Esencial (el cliente NECESITA esto)
- `2` = Recomendado (mejora la experiencia)
- `3` = Opcional (nice to have)

---

## NÚMERO DE WHATSAPP

Actualizar el número de WhatsApp en el archivo `GearConfiguratorModal.tsx`:
```typescript
href="https://wa.me/56912345678?text=..."
```

Cambiar `56912345678` por el número real de Planeta Outdoor.

---

## RECURSOS ADICIONALES (OPCIONAL)

Puedes agregar enlaces a tutoriales y guías para cada kit:

```typescript
tutorial: {
  title: 'Cómo armar tu caña por primera vez',
  url: '/blog/como-armar-cana',  // URL del post del blog
},
guide: {
  title: 'Primeros pasos en pesca con mosca',
  url: '/blog/primeros-pasos',
},
```

---

## CONTACTO PARA SOPORTE TÉCNICO

Si necesitas ayuda configurando el sistema, contacta al desarrollador.
