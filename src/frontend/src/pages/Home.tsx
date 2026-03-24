import { Button } from "@/components/ui/button";
import {
  Award,
  ChevronRight,
  Flame,
  Mail,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { useProductCatalog } from "../hooks/useQueries";
import { Link, useNavigate } from "../hooks/useRouter";

type SeedProduct = {
  sku: string;
  nameEn: string;
  nameFr: string;
  priceCents: bigint;
  category: string;
  image: string;
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    sku: "MB-SHEET-40",
    nameEn: "Premium Baking Sheets 40 GSM",
    nameFr: "Feuilles de Cuisson Premium 40 GSM",
    priceCents: BigInt(4500),
    category: "sheet",
    image: "/assets/generated/product-sheets-40gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-ROLL-40",
    nameEn: "Standard Baking Roll 40 GSM",
    nameFr: "Rouleau de Cuisson Standard 40 GSM",
    priceCents: BigInt(3800),
    category: "roll",
    image: "/assets/generated/product-roll-40gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-SHEET-60",
    nameEn: "Heavy Duty Sheets 60 GSM",
    nameFr: "Feuilles Robustes 60 GSM",
    priceCents: BigInt(6500),
    category: "sheet",
    image: "/assets/generated/product-sheets-60gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-ROLL-90",
    nameEn: "Industrial Roll 90 GSM",
    nameFr: "Rouleau Industriel 90 GSM",
    priceCents: BigInt(8900),
    category: "roll",
    image: "/assets/generated/product-roll-90gsm.dim_600x500.jpg",
  },
];

const TESTIMONIALS = [
  {
    quoteKey: "test_1_quote",
    nameKey: "test_1_name",
    roleKey: "test_1_role",
    id: "t1",
  },
  {
    quoteKey: "test_2_quote",
    nameKey: "test_2_name",
    roleKey: "test_2_role",
    id: "t2",
  },
  {
    quoteKey: "test_3_quote",
    nameKey: "test_3_name",
    roleKey: "test_3_role",
    id: "t3",
  },
];

export default function Home() {
  const { t, lang } = useLanguage();
  const { data: catalogData } = useProductCatalog();
  const navigate = useNavigate();

  const products: SeedProduct[] =
    catalogData && catalogData.length > 0
      ? catalogData.slice(0, 4).map((p, i) => ({
          sku: p.sku,
          nameEn: p.nameEn,
          nameFr: p.nameFr,
          priceCents: p.priceCents,
          category: String(p.category),
          image: SEED_PRODUCTS[i % SEED_PRODUCTS.length].image,
        }))
      : SEED_PRODUCTS;

  const benefits = [
    { icon: <MapPin className="w-8 h-8" />, key: "why_1", desc: "why_1_desc" },
    { icon: <Flame className="w-8 h-8" />, key: "why_2", desc: "why_2_desc" },
    { icon: <Shield className="w-8 h-8" />, key: "why_3", desc: "why_3_desc" },
    { icon: <Award className="w-8 h-8" />, key: "why_4", desc: "why_4_desc" },
  ];

  const useCasePreviews = [
    {
      img: "/assets/generated/use-case-bakery.dim_800x600.jpg",
      key: "uc_1",
      num: "01",
    },
    {
      img: "/assets/generated/use-case-industrial.dim_800x600.jpg",
      key: "uc_2",
      num: "02",
    },
    {
      img: "/assets/generated/use-case-packaging.dim_800x600.jpg",
      key: "uc_3",
      num: "03",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[580px] md:min-h-[680px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-bakery.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="home.section"
      >
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block bg-brand-red px-3 py-1 mb-4">
              <span className="font-oswald text-sm font-bold text-white tracking-[0.25em]">
                {t("hero_pre")}
              </span>
            </div>
            <h1 className="font-oswald font-bold text-4xl md:text-6xl text-white leading-tight max-w-3xl mb-6">
              {t("hero_title")}
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl mb-8 font-body leading-relaxed">
              {t("hero_sub")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/shop")}
                className="bg-brand-dark hover:bg-gray-900 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto border border-gray-600"
                data-ocid="home.primary_button"
              >
                {t("hero_cta1")}
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="bg-white hover:bg-gray-100 text-brand-dark font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
                data-ocid="home.secondary_button"
              >
                {t("hero_cta2")}
              </Button>
            </div>
          </motion.div>
          <div className="flex flex-wrap gap-6 mt-12">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-red rounded-full" />
              <span className="font-oswald text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {t("hero_badge_left")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-red rounded-full" />
              <span className="font-oswald text-xs font-semibold text-gray-400 tracking-widest uppercase">
                {t("hero_badge_right")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why MultiBake */}
      <section id="why" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-oswald font-bold text-3xl md:text-4xl text-brand-dark mb-3">
              {t("why_title")}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red mb-4">
                  {b.icon}
                </div>
                <h3 className="font-oswald font-semibold text-brand-dark text-base mb-2">
                  {t(b.key)}
                </h3>
                <p className="text-sm text-gray-600 font-body leading-relaxed">
                  {t(b.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Preview */}
      <section className="bg-brand-gray py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="font-oswald font-bold text-3xl md:text-4xl text-brand-dark">
                {t("uc_title")}
              </h2>
              <div className="w-16 h-1 bg-brand-red mt-3" />
            </div>
            <Link
              to="/use-cases"
              className="flex items-center gap-2 font-oswald text-sm font-semibold text-brand-red uppercase tracking-widest hover:underline"
              data-ocid="home.link"
            >
              {t("uc_view")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCasePreviews.map((uc, i) => (
              <motion.div
                key={uc.key}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden cursor-pointer"
                onClick={() => navigate("/use-cases")}
                data-ocid={`home.item.${i + 1}`}
              >
                <img
                  src={uc.img}
                  alt={t(uc.key)}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <div className="font-oswald text-brand-red font-bold text-lg">
                    {uc.num}
                  </div>
                  <div className="font-oswald font-semibold text-white text-xl">
                    {t(uc.key)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-oswald font-bold text-3xl md:text-4xl text-brand-dark mb-3">
              {t("prod_title")}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => {
              const name = lang === "fr" ? p.nameFr : p.nameEn;
              const price = Number(p.priceCents);
              const isRoll = p.category === "roll";
              return (
                <motion.div
                  key={p.sku}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="border border-gray-200 group"
                  data-ocid={`products.item.${i + 1}`}
                >
                  <div className="overflow-hidden">
                    <img
                      src={p.image}
                      alt={name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-oswald text-[10px] font-semibold text-brand-red uppercase tracking-widest mb-1">
                      {isRoll ? t("prod_roll") : t("prod_sheet")}
                    </div>
                    <h3 className="font-oswald font-semibold text-brand-dark text-sm mb-2 leading-tight">
                      {name}
                    </h3>
                    <div className="font-oswald font-bold text-brand-red text-xl mb-3">
                      ${(price / 100).toFixed(2)}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        {isRoll ? t("prod_per_roll") : t("prod_per_box")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-brand-dark hover:bg-gray-800 text-white font-oswald text-[10px] font-bold tracking-widest uppercase rounded-none h-8 flex items-center gap-1"
                        onClick={() => navigate("/contact")}
                        data-ocid={`products.button.${i + 1}`}
                      >
                        <Mail className="w-3 h-3" />
                        {t("prod_contact_order")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-oswald text-[10px] font-bold tracking-widest uppercase rounded-none h-8 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
                        onClick={() => navigate("/shop")}
                        data-ocid={`products.secondary_button.${i + 1}`}
                      >
                        {t("prod_view")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-dark py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-oswald font-bold text-3xl md:text-4xl text-white mb-3">
              {t("test_title")}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-6"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-brand-red text-brand-red"
                    />
                  ))}
                </div>
                <p className="text-gray-300 font-body text-sm leading-relaxed italic mb-5">
                  "{t(test.quoteKey)}"
                </p>
                <div>
                  <div className="font-oswald font-semibold text-white text-sm">
                    {t(test.nameKey)}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {t(test.roleKey)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-brand-red py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-oswald font-bold text-3xl md:text-5xl text-white mb-8 tracking-wide">
            {t("cta_headline")}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/contact")}
              className="bg-white hover:bg-gray-100 text-brand-red font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
              data-ocid="cta.primary_button"
            >
              {t("cta_samples")}
            </Button>
            <Button
              onClick={() => navigate("/shop")}
              className="bg-brand-dark hover:bg-gray-900 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
              data-ocid="cta.secondary_button"
            >
              {t("cta_catalog")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
