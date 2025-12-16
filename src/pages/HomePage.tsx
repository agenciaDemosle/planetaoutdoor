import { Helmet } from 'react-helmet-async'
import {
  HeroSlider,
  CategoryGrid,
  FeaturedProducts,
  PatagoniaWadersSection,
  NewsletterSection,
} from '../components/landing'
import { BlogSection } from '../components/landing/BlogSection'
import { SkwalaSection } from '../components/landing/SkwalaSection'

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Planeta Outdoor | Equipamiento Profesional de Pesca - Temuco, Chile</title>
        <meta
          name="description"
          content="Tienda especializada en equipamiento de pesca con mosca. Waders, botas de vadeo, cañas, carretes y accesorios de las mejores marcas. Envío a todo Chile desde Temuco."
        />
      </Helmet>

      {/* Hero Slider - Full width carousel */}
      <HeroSlider />

      {/* Category Grid - 2x2 grandes estilo redecora.cl */}
      <CategoryGrid />

      {/* Patagonia Waders Section - Banner + 2 waders with video */}
      <PatagoniaWadersSection />

      {/* Skwala Section - Premium fishing gear */}
      <SkwalaSection />

      {/* Featured Products - Real products from WooCommerce */}
      <FeaturedProducts />

      {/* Blog Section - Stories from the river */}
      <BlogSection />

      {/* Newsletter Section - Full width image */}
      <NewsletterSection />
    </>
  )
}
