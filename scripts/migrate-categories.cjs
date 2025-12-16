/**
 * Script para migrar productos de categorías antiguas a nuevas
 * Planeta Outdoor - WooCommerce
 */

const https = require('https');

const BASE_URL = 'planetaoutdoor.cl';
const CONSUMER_KEY = 'ck_14978a0dbb9a4abf3fb9a286cfdc2ed6f6e7f3be';
const CONSUMER_SECRET = 'cs_d62d8dd62a2f60b531f9e4d10327e764b22c1843';

// Mapeo de categorías antiguas → nuevas
const CATEGORY_MAPPING = {
  // Pesca con Mosca
  631: 731,  // Cañas → Cañas de Mosca
  636: 732,  // Carretes → Carretes de Mosca
  637: 733,  // Líneas → Líneas de Mosca
  635: 734,  // Leaders → Leaders y Tippets
  633: 735,  // Moscas → Moscas
  230: 736,  // Chalecos y bolsos → Chalecos y Packs Mosqueros
  123: 737,  // Chinguillos → Chinguillos y Sacaderas
  133: 738,  // Accesorios → Accesorios Mosqueros
  641: 738,  // Cajas → Accesorios Mosqueros (sub: cajas)

  // Waders & Botas
  639: 725,  // Botas → Waders & Botas (parent, decidir sub después)

  // Ropa Técnica
  119: 796,  // Gorros → Gorros y Jockeys
  231: 791,  // Chaquetas → Chaquetas Impermeables

  // Pesca Tradicional
  417: 764,  // Nylon y multifilamento → Nylon y Multifilamento

  // Embarcaciones
  499: 814,  // Float tubes → Float Tubes & Accesorios

  // Accesorios de Pesca
  473: 740,  // Gafas y Straps → Lentes Polarizados de Pesca
  232: 738,  // Infaltables → Accesorios Mosqueros
  453: 738,  // Flashers y parabans → Accesorios Mosqueros
  379: 790,  // Gearaid → Accesorios de Vadeo

  // Outdoor & Camping
  157: 805,  // Coolers → Neveras & Coolers
  221: 810,  // Calzado → Calzado Outdoor
  501: 808,  // Carpas y sacos → Descanso & Sacos
  500: 807,  // Cocinillas → Cocina & Campamento
  698: 815,  // Actividades Acuaticas → Tablas SUP/SUB
};

// Categorías padre antiguas que queremos reemplazar (no solo añadir)
const PARENT_CATEGORIES_TO_REPLACE = [630, 228, 96]; // Equipo de Pesca, Accesorios de Pesca, Outdoors

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/wp-json/wc/v3${path}`,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
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

async function getProductsByCategory(categoryId, page = 1) {
  const path = `/products?category=${categoryId}&per_page=100&page=${page}`;
  return makeRequest('GET', path);
}

async function updateProductCategories(productId, categoryIds) {
  const path = `/products/${productId}`;
  const data = {
    categories: categoryIds.map(id => ({ id }))
  };
  return makeRequest('PUT', path, data);
}

async function migrateCategory(oldCategoryId, newCategoryId) {
  console.log(`\n📦 Migrando categoría ${oldCategoryId} → ${newCategoryId}`);

  let page = 1;
  let totalMigrated = 0;

  while (true) {
    const products = await getProductsByCategory(oldCategoryId, page);

    if (!Array.isArray(products) || products.length === 0) {
      break;
    }

    console.log(`  Página ${page}: ${products.length} productos`);

    for (const product of products) {
      // Obtener categorías actuales
      let currentCategories = product.categories.map(c => c.id);

      // Remover la categoría antigua
      currentCategories = currentCategories.filter(id => id !== oldCategoryId);

      // Remover categorías padre antiguas si existen
      currentCategories = currentCategories.filter(id => !PARENT_CATEGORIES_TO_REPLACE.includes(id));

      // Añadir la nueva categoría
      if (!currentCategories.includes(newCategoryId)) {
        currentCategories.push(newCategoryId);
      }

      // Actualizar el producto
      try {
        await updateProductCategories(product.id, currentCategories);
        console.log(`    ✅ ${product.id}: ${product.name.substring(0, 40)}...`);
        totalMigrated++;
      } catch (error) {
        console.log(`    ❌ ${product.id}: Error - ${error.message}`);
      }

      // Pequeña pausa para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (products.length < 100) {
      break;
    }

    page++;
  }

  console.log(`  Total migrados: ${totalMigrated}`);
  return totalMigrated;
}

async function main() {
  console.log('🚀 Iniciando migración de categorías Planeta Outdoor');
  console.log('='.repeat(50));

  // Obtener argumento de línea de comandos para categoría específica
  const specificCategory = process.argv[2] ? parseInt(process.argv[2]) : null;

  let totalProducts = 0;

  if (specificCategory) {
    // Migrar solo una categoría específica
    if (CATEGORY_MAPPING[specificCategory]) {
      totalProducts = await migrateCategory(specificCategory, CATEGORY_MAPPING[specificCategory]);
    } else {
      console.log(`❌ Categoría ${specificCategory} no encontrada en el mapeo`);
    }
  } else {
    // Migrar todas las categorías
    for (const [oldId, newId] of Object.entries(CATEGORY_MAPPING)) {
      const migrated = await migrateCategory(parseInt(oldId), newId);
      totalProducts += migrated;

      // Pausa entre categorías
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migración completada. Total productos actualizados: ${totalProducts}`);
}

main().catch(console.error);

// Additional mappings found
const ADDITIONAL_MAPPING = {
  638: 725,  // Waders → Waders & Botas
  632: 763,  // Señuelos → Señuelos (bajo Pesca Tradicional)
  413: 794,  // Poleras UV y Camisas → Ropa con Filtro UV
  669: 726,  // Vestuario → Ropa Técnica
  122: 804,  // Termos → Hidratación
  511: 810,  // Zapatos → Calzado Outdoor
};

async function runAdditionalMigration() {
  console.log('\n🚀 Migrando categorías adicionales');
  console.log('='.repeat(50));
  
  let totalProducts = 0;
  
  for (const [oldId, newId] of Object.entries(ADDITIONAL_MAPPING)) {
    const migrated = await migrateCategory(parseInt(oldId), newId);
    totalProducts += migrated;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migración adicional completada. Total: ${totalProducts}`);
}

if (process.argv[2] === 'additional') {
  runAdditionalMigration().catch(console.error);
}
