import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link, useNavigate } from "../../hooks/useRouter";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav_shop"), href: "/shop" },
    { label: t("nav_about"), href: "/about" },
    { label: t("nav_why"), href: "/#why" },
    { label: t("nav_usecases"), href: "/use-cases" },
    { label: t("nav_contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-dark border-b-2 border-brand-red shadow-heavy">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/uploads/jason_logo-019d1faf-4d59-7299-9569-64c247e0d879-1.png"
            alt="MultiBake Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-oswald text-sm font-medium tracking-widest text-gray-300 hover:text-brand-red transition-colors uppercase"
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="font-oswald text-xs font-bold tracking-widest border border-gray-500 text-gray-300 hover:border-brand-red hover:text-brand-red px-3 py-1.5 transition-colors uppercase"
            data-ocid="nav.toggle"
          >
            {lang === "en" ? "FR" : "EN"}
          </button>

          <button
            type="button"
            className="relative"
            onClick={() => navigate("/shop")}
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-brand-red transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <Button
            className="hidden md:flex bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-xs uppercase rounded-none px-4 py-2 h-auto"
            onClick={() => navigate("/contact")}
            data-ocid="nav.primary_button"
          >
            {t("nav_samples")}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden text-gray-300 hover:text-white"
                data-ocid="nav.open_modal_button"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-brand-dark border-brand-red w-72"
              data-ocid="nav.sheet"
            >
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-oswald text-lg font-medium tracking-widest text-gray-300 hover:text-brand-red transition-colors uppercase"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  className="bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none mt-4"
                  onClick={() => {
                    navigate("/contact");
                    setMobileOpen(false);
                  }}
                  data-ocid="nav.primary_button"
                >
                  {t("nav_samples")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
