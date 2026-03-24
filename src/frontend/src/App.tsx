import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { RouterProvider, useRouter } from "./hooks/useRouter";
import About from "./pages/About";
import CheckoutCancel from "./pages/CheckoutCancel";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import UseCases from "./pages/UseCases";

function Routes() {
  const { pathname } = useRouter();
  const renderPage = () => {
    if (pathname === "/") return <Home />;
    if (pathname === "/shop") return <Shop />;
    if (pathname === "/about") return <About />;
    if (pathname === "/use-cases") return <UseCases />;
    if (pathname === "/contact") return <Contact />;
    if (pathname === "/checkout/success") return <CheckoutSuccess />;
    if (pathname === "/checkout/cancel") return <CheckoutCancel />;
    return <Home />;
  };
  return <>{renderPage()}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <RouterProvider>
          <div className="steel-bg min-h-screen">
            <div className="max-w-[1400px] mx-auto bg-white shadow-heavy">
              <Header />
              <main>
                <Routes />
              </main>
              <Footer />
            </div>
          </div>
          <Toaster />
        </RouterProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
