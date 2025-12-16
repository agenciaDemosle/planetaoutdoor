const https = require('https');

const WOO_URL = 'planetaoutdoor.cl';
const CONSUMER_KEY = 'ck_14978a0dbb9a4abf3fb9a286cfdc2ed6f6e7f3be';
const CONSUMER_SECRET = 'cs_d62d8dd62a2f60b531f9e4d10327e764b22c1843';

// Nueva estructura de categorías
const NEW_CATEGORIES = [
  {
    name: 'Pesca con Mosca',
    slug: 'pesca-con-mosca',
    children: [
      { name: 'Cañas', slug: 'canas' },
      { name: 'Carretes', slug: 'carretes' },
      { name: 'Líneas', slug: 'lineas' },
      { name: 'Leaders y Tippets', slug: 'leaders-tippets' },
      { name: 'Moscas', slug: 'moscas' },
      { name: 'Señuelos', slug: 'senuelos' },
      { name: 'Accesorios de Pesca', slug: 'accesorios-pesca' },
    ]
  },
  {
    name: 'Atado de Moscas',
    slug: 'atado-de-moscas',
    children: [
      { name: 'Plumas y Pelos', slug: 'plumas-pelos' },
      { name: 'Sintéticos', slug: 'sinteticos' },
      { name: 'Anzuelos', slug: 'anzuelos' },
      { name: 'Hilos y Tinsels', slug: 'hilos-tinsels' },
      { name: 'Ojos y Cabezas', slug: 'ojos-cabezas' },
      { name: 'Herramientas de Atado', slug: 'herramientas-atado' },
    ]
  },
  {
    name: 'Pesca Tradicional',
    slug: 'pesca-tradicional',
    children: [
      { name: 'Cañas Spinning/Casting', slug: 'canas-spinning-casting' },
      { name: 'Carretes Spinning', slug: 'carretes-spinning' },
      { name: 'Señuelos Tradicionales', slug: 'senuelos-tradicionales' },
      { name: 'Líneas y Nylon', slug: 'lineas-nylon' },
    ]
  },
  {
    name: 'Waders & Botas',
    slug: 'waders-botas',
    children: [
      { name: 'Waders', slug: 'waders' },
      { name: 'Botas de Vadeo', slug: 'botas-de-vadeo' },
      { name: 'Accesorios de Vadeo', slug: 'accesorios-vadeo' },
    ]
  },
  {
    name: 'Ropa Técnica & Abrigo',
    slug: 'ropa-tecnica-abrigo',
    children: [
      { name: 'Chaquetas', slug: 'chaquetas' },
      { name: 'Pantalones', slug: 'pantalones' },
      { name: 'Poleras y Camisas', slug: 'poleras-camisas' },
      { name: 'Gorros y Accesorios', slug: 'gorros-accesorios' },
    ]
  },
  {
    name: 'Mochilas & Equipamiento',
    slug: 'mochilas-equipamiento',
    children: [
      { name: 'Mochilas y Bolsos', slug: 'mochilas-bolsos' },
      { name: 'Cajas y Organizadores', slug: 'cajas-organizadores' },
      { name: 'Chalecos de Pesca', slug: 'chalecos-pesca' },
      { name: 'Chinguillos y Redes', slug: 'chinguillos-redes' },
    ]
  },
  {
    name: 'Outdoor & Camping',
    slug: 'outdoor-camping',
    children: [
      { name: 'Carpas', slug: 'carpas' },
      { name: 'Sacos de Dormir', slug: 'sacos-dormir' },
      { name: 'Iluminación', slug: 'iluminacion' },
      { name: 'Cocina de Camping', slug: 'cocina-camping' },
    ]
  },
  {
    name: 'Embarcaciones & Flotación',
    slug: 'embarcaciones-flotacion',
    children: [
      { name: 'Float Tubes', slug: 'float-tubes' },
      { name: 'Kayaks', slug: 'kayaks' },
      { name: 'Accesorios de Navegación', slug: 'accesorios-navegacion' },
    ]
  },
  {
    name: 'Ofertas',
    slug: 'ofertas',
    children: []
  }
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    // Use query parameters for authentication (OAuth 1.0 style)
    const separator = path.includes('?') ? '&' : '?';
    const authPath = `${path}${separator}consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const options = {
      hostname: WOO_URL,
      port: 443,
      path: `/wp-json/wc/v3${authPath}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${body.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function getExistingCategories() {
  console.log('📋 Obteniendo categorías existentes...');
  const categories = await makeRequest('GET', '/products/categories?per_page=100');
  console.log(`   Encontradas ${categories.length} categorías`);
  return categories;
}

async function createCategory(name, slug, parentId = 0) {
  console.log(`   Creando: ${name} (slug: ${slug}, parent: ${parentId})`);
  try {
    const result = await makeRequest('POST', '/products/categories', {
      name,
      slug,
      parent: parentId
    });
    console.log(`   ✅ Creada: ${name} (ID: ${result.id})`);
    return result;
  } catch (error) {
    if (error.message.includes('term_exists')) {
      console.log(`   ⚠️ Ya existe: ${name}, buscando...`);
      const existing = await makeRequest('GET', `/products/categories?slug=${slug}`);
      if (existing.length > 0) {
        return existing[0];
      }
    }
    console.log(`   ❌ Error creando ${name}: ${error.message}`);
    return null;
  }
}

async function updateCategoryParent(categoryId, parentId) {
  console.log(`   Actualizando categoría ${categoryId} -> parent: ${parentId}`);
  try {
    const result = await makeRequest('PUT', `/products/categories/${categoryId}`, {
      parent: parentId
    });
    console.log(`   ✅ Actualizada`);
    return result;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Iniciando reorganización de categorías...\n');

  // Obtener categorías existentes
  const existingCategories = await getExistingCategories();
  const existingBySlug = {};
  existingCategories.forEach(cat => {
    existingBySlug[cat.slug] = cat;
  });

  console.log('\n📁 Creando nueva estructura de categorías...\n');

  const createdCategories = {};

  // Crear categorías padre
  for (const parent of NEW_CATEGORIES) {
    console.log(`\n🏷️ Categoría principal: ${parent.name}`);

    let parentCat;
    if (existingBySlug[parent.slug]) {
      console.log(`   Ya existe (ID: ${existingBySlug[parent.slug].id})`);
      parentCat = existingBySlug[parent.slug];
      // Asegurar que sea categoría raíz
      if (parentCat.parent !== 0) {
        parentCat = await updateCategoryParent(parentCat.id, 0);
        await delay(300);
      }
    } else {
      parentCat = await createCategory(parent.name, parent.slug, 0);
      await delay(500);
    }

    if (parentCat) {
      createdCategories[parent.slug] = parentCat;
    }

    // Crear subcategorías
    for (const child of parent.children) {
      let childCat;
      if (existingBySlug[child.slug]) {
        console.log(`   Subcategoría existente: ${child.name} (ID: ${existingBySlug[child.slug].id})`);
        childCat = existingBySlug[child.slug];
        // Actualizar parent si es diferente
        if (parentCat && childCat.parent !== parentCat.id) {
          childCat = await updateCategoryParent(childCat.id, parentCat.id);
          await delay(300);
        }
      } else {
        if (parentCat) {
          childCat = await createCategory(child.name, child.slug, parentCat.id);
          await delay(500);
        }
      }
      if (childCat) {
        createdCategories[child.slug] = childCat;
      }
    }
  }

  console.log('\n✅ Estructura de categorías creada exitosamente!\n');

  // Mostrar resumen
  console.log('📊 Resumen de categorías:');
  for (const parent of NEW_CATEGORIES) {
    const parentCat = createdCategories[parent.slug];
    console.log(`\n${parent.name} (ID: ${parentCat?.id || 'N/A'})`);
    for (const child of parent.children) {
      const childCat = createdCategories[child.slug];
      console.log(`  └─ ${child.name} (ID: ${childCat?.id || 'N/A'})`);
    }
  }
}

main().catch(console.error);
