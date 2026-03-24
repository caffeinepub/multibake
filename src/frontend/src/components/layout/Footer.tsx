import { Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "../../hooks/useRouter";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/jason_logo-019d1faf-4d59-7299-9569-64c247e0d879-1.png"
                alt="MultiBake Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed">{t("footer_tagline")}</p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-500 hover:text-brand-red transition-colors"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-500 hover:text-brand-red transition-colors"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-brand-red transition-colors"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-oswald font-semibold text-white text-sm tracking-widest mb-4 uppercase">
              {t("footer_quick")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-red transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-red transition-colors"
                >
                  {t("nav_shop")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-brand-red transition-colors"
                >
                  {t("nav_about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/use-cases"
                  className="hover:text-brand-red transition-colors"
                >
                  {t("nav_usecases")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-oswald font-semibold text-white text-sm tracking-widest mb-4 uppercase">
              {t("footer_products")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-red transition-colors"
                >
                  Premium Baking Sheets 40 GSM
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-red transition-colors"
                >
                  Standard Baking Roll 40 GSM
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-red transition-colors"
                >
                  Heavy Duty Sheets 60 GSM
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-brand-red transition-colors"
                >
                  Industrial Roll 90 GSM
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-oswald font-semibold text-white text-sm tracking-widest mb-4 uppercase">
              {t("footer_contact_col")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
                <span>514-641-4422</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
                <a
                  href="mailto:info@multibake.ca"
                  className="hover:text-brand-red transition-colors"
                >
                  info@multibake.ca
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
                <span>2001 Boul. des Sources, Pointe-Claire, QC H9R 5Z4</span>
              </li>
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-4 bg-brand-red text-white font-oswald text-xs font-bold tracking-widest uppercase px-4 py-2 hover:bg-red-800 transition-colors"
            >
              {t("nav_contact")}
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>\u00a9 {year} MultiBake. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
