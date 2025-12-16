import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
import { OrderConfirmedPage } from './pages/OrderConfirmedPage'
import { PaymentSuccessPage, PaymentFailurePage, PaymentPendingPage } from './pages/PaymentResultPage'
import { TransbankReturnPage } from './pages/TransbankReturnPage'
import { TerminosCondicionesPage } from './pages/TerminosCondicionesPage'
import { FAQArgentinaPage } from './pages/FAQArgentinaPage'
import { CondicionesUsoPage } from './pages/CondicionesUsoPage'
import { LoginPage } from './pages/LoginPage'
import { MiCuentaPage } from './pages/MiCuentaPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tienda" element={<TiendaPage />} />
              <Route path="/tienda/:category" element={<TiendaPage />} />
              <Route path="/producto/:slug" element={<ProductoPage />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/gracias" element={<ThankYouPage />} />
              <Route path="/pedido-confirmado" element={<OrderConfirmedPage />} />
              <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
              <Route path="/pago-fallido" element={<PaymentFailurePage />} />
              <Route path="/pago-pendiente" element={<PaymentPendingPage />} />
              <Route path="/transbank/retorno" element={<TransbankReturnPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
              <Route path="/faq-argentina" element={<FAQArgentinaPage />} />
              <Route path="/condiciones-de-uso" element={<CondicionesUsoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mi-cuenta" element={<MiCuentaPage />} />
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
