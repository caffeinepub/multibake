import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

const useCaseData = [
  {
    titleKey: "uc_bakery_title",
    benefitKey: "uc_bakery_benefit",
    image: "/assets/generated/use-case-bakery.dim_800x600.jpg",
    num: "01",
    items: [
      {
        en: "Cookies (no sticking, clean release)",
        fr: "Biscuits (aucun collage, d\u00e9gagement propre)",
      },
      { en: "Croissants & pastries", fr: "Croissants et viennoiseries" },
      { en: "Cupcakes & muffins", fr: "Cupcakes et muffins" },
      { en: "Sheet pan baking", fr: "Cuisson sur plaque" },
    ],
  },
  {
    titleKey: "uc_industrial_title",
    benefitKey: "uc_industrial_benefit",
    image: "/assets/generated/use-case-industrial.dim_800x600.jpg",
    num: "02",
    items: [
      { en: "Bread production lines", fr: "Lignes de production de pain" },
      {
        en: "Conveyor baking systems",
        fr: "Syst\u00e8mes de cuisson sur convoyeur",
      },
      {
        en: "High-volume tray baking",
        fr: "Cuisson sur plateau \u00e0 haut volume",
      },
    ],
  },
  {
    titleKey: "uc_foodservice_title",
    benefitKey: "uc_foodservice_benefit",
    image: "/assets/generated/use-case-foodservice.dim_800x600.jpg",
    num: "03",
    items: [
      { en: "Sandwich wraps", fr: "Emballage de sandwichs" },
      { en: "Burger wraps", fr: "Emballage de burgers" },
      {
        en: "Butter & deli packaging",
        fr: "Emballage de beurre et charcuterie",
      },
      {
        en: "Interleaving meat or cheese",
        fr: "Intercalation de viande ou fromage",
      },
    ],
  },
  {
    titleKey: "uc_packaging_title",
    benefitKey: "uc_packaging_benefit",
    image: "/assets/generated/use-case-packaging.dim_800x600.jpg",
    num: "04",
    items: [
      {
        en: "Meat & fish interleaving",
        fr: "Intercalation de viande et poisson",
      },
      {
        en: "Frozen food separation",
        fr: "S\u00e9paration des aliments surgel\u00e9s",
      },
      { en: "Chocolate & confectionery", fr: "Chocolat et confiserie" },
      {
        en: "High-moisture applications",
        fr: "Applications \u00e0 haute teneur en humidit\u00e9",
      },
    ],
  },
];

export default function UseCases() {
  const { t, lang } = useLanguage();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-brand-dark py-16 px-6 text-center">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl text-white mb-3">
          {t("uc_page_title")}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mb-4" />
        <p className="text-gray-400 font-body max-w-xl mx-auto">
          {t("uc_page_sub")}
        </p>
      </div>

      {/* Use Cases */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {useCaseData.map((uc, i) => (
          <motion.div
            key={uc.titleKey}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            data-ocid={`usecases.item.${i + 1}`}
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="overflow-hidden border-l-4 border-brand-red">
                <img
                  src={uc.image}
                  alt={t(uc.titleKey)}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <span className="font-oswald font-bold text-4xl text-brand-red/20">
                {uc.num}
              </span>
              <h2 className="font-oswald font-bold text-3xl text-brand-dark mb-4">
                {t(uc.titleKey)}
              </h2>
              <div className="w-12 h-1 bg-brand-red mb-6" />
              <ul className="space-y-3 mb-6">
                {uc.items.map((item) => (
                  <li key={item.en} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-red mt-0.5 shrink-0" />
                    <span className="text-gray-700 font-body text-sm">
                      {lang === "fr" ? item.fr : item.en}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bg-brand-red/10 border-l-4 border-brand-red px-4 py-3">
                <span className="font-oswald font-bold text-xs text-brand-red uppercase tracking-widest">
                  {t("uc_key_benefit")}
                </span>
                <span className="font-body text-sm text-brand-dark ml-2">
                  {t(uc.benefitKey)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
