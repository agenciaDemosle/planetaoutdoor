import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { Layout } from './components/layout/Layout'
import {
  HomePage,
  ProductsPage,
  CheckoutPage,
  ThankYouPage,
  ServicesPage,
  ContactPage,
  TiendaPage,
  ProductoPage,
  CarritoPage,
  BlogPage,
  BlogPostPage,
  NosotrosPage,
} from './pages'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tienda" element={<TiendaPage />} />
              <Route path="/tienda/:category" element={<TiendaPage />} />
              <Route path="/producto/:slug" element={<ProductoPage />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/gracias" element={<ThankYouPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              {/* Legacy routes */}
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/servicios" element={<ServicesPage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
