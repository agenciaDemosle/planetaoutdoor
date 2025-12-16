import { TopBar, MainHeader } from '../Header'
import { Footer } from '../Footer'
import { ScrollToTop } from '../../common/ScrollToTop'
import { CartDrawer } from '../../cart/CartDrawer'
import { WhatsAppWidget } from '../../common/WhatsAppWidget'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <TopBar />
      <MainHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppWidget />
    </div>
  )
}
