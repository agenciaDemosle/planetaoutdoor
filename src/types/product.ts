export interface WooProductVariation {
  id: number
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: string
  stock_quantity: number | null
  image: {
    id: number
    src: string
    name: string
    alt: string
  } | null
  attributes: Array<{
    id: number
    name: string
    slug: string
    option: string
  }>
}

export interface ProductVariation {
  id: number
  price: number
  regularPrice: number
  salePrice: number | null
  onSale: boolean
  stockStatus: string
  stockQuantity: number | null
  image: string | null
  attributes: Record<string, string>
}

export interface WooProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  stock_status: string
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  images: Array<{
    id: number
    src: string
    name: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  attributes: Array<{
    id: number
    name: string
    position: number
    visible: boolean
    variation: boolean
    options: string[]
  }>
  meta_data: Array<{
    id: number
    key: string
    value: string
  }>
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  regularPrice: number
  salePrice: number | null
  onSale: boolean
  imageUrl: string
  images: string[]
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  stockStatus: string
  stockQuantity: number | null
  attributes: Array<{
    name: string
    options: string[]
  }>
  hasVariations?: boolean
  // Custom fields
  capacity?: string
  energyRating?: string
  inverter?: boolean
  installationPrice?: number
}

// Clean HTML content - strip tags for plain text, or preserve HTML for rich content
function cleanHtmlContent(html: string, preserveHtml = false): string {
  if (!html) return ''

  // If preserving HTML, return as-is (no shortcode removal needed for WooCommerce)
  if (preserveHtml) {
    return html.trim()
  }

  // For plain text, strip everything
  return html
    // Remove Divi shortcodes
    .replace(/\[et_pb_[^\]]*\][^[]*\[\/et_pb_[^\]]*\]/gi, '')
    .replace(/\[\/?\w+[^\]]*\]/g, '') // Only remove shortcode-like brackets
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

export function mapWooProductToProduct(woo: WooProduct): Product {
  const getMetaValue = (key: string): string | undefined => {
    const meta = woo.meta_data.find((m) => m.key === key)
    return meta?.value
  }

  return {
    id: woo.id,
    name: woo.name,
    slug: woo.slug,
    description: cleanHtmlContent(woo.description, true), // Preserve HTML for videos
    shortDescription: cleanHtmlContent(woo.short_description, true), // Preserve HTML
    price: parseFloat(woo.price) || 0,
    regularPrice: parseFloat(woo.regular_price) || 0,
    salePrice: woo.sale_price ? parseFloat(woo.sale_price) : null,
    onSale: woo.on_sale,
    imageUrl: woo.images[0]?.src || '',
    images: woo.images.map((img) => img.src),
    categories: woo.categories,
    tags: woo.tags,
    stockStatus: woo.stock_status,
    stockQuantity: woo.stock_quantity,
    attributes: woo.attributes.map((attr) => ({
      name: attr.name,
      options: attr.options,
    })),
    capacity: getMetaValue('_capacity'),
    energyRating: getMetaValue('_energy_rating'),
    inverter: getMetaValue('_inverter') === 'yes',
    installationPrice: getMetaValue('_installation_price')
      ? parseFloat(getMetaValue('_installation_price')!)
      : undefined,
    hasVariations: woo.type === 'variable',
  }
}

export function mapWooVariationToVariation(variation: WooProductVariation): ProductVariation {
  const attributes: Record<string, string> = {}
  variation.attributes.forEach((attr) => {
    attributes[attr.name] = attr.option
  })

  return {
    id: variation.id,
    price: parseFloat(variation.price) || 0,
    regularPrice: parseFloat(variation.regular_price) || 0,
    salePrice: variation.sale_price ? parseFloat(variation.sale_price) : null,
    onSale: variation.on_sale,
    stockStatus: variation.stock_status,
    stockQuantity: variation.stock_quantity,
    image: variation.image?.src || null,
    attributes,
  }
}
