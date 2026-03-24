import { Button } from "@/components/ui/button";
import { AlertCircle, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "../hooks/useRouter";

type CatalogProduct = {
  id: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  categoryEn: string;
  categoryFr: string;
};

const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "parchment-paper",
    nameEn: "Parchment Paper (Baking Paper)",
    nameFr: "Papier Parchemin (Papier de Cuisson)",
    descriptionEn:
      "Professional-grade silicone-coated parchment sheets. Non-stick, heat-resistant up to 230\u00b0C. Use: baking, roasting, steaming, cooking prep. Formats: sheets, rolls, round sheets. Customization available.",
    descriptionFr:
      "Feuilles parchemin enduites de silicone de qualit\u00e9 professionnelle. Antiadh\u00e9sif, r\u00e9sistant \u00e0 la chaleur jusqu\u2019\u00e0 230\u00b0C. Usage\u00a0: cuisson, r\u00f4tissage, cuisson vapeur. Formats\u00a0: feuilles, rouleaux, feuilles rondes. Personnalisation disponible.",
    categoryEn: "Baking Paper",
    categoryFr: "Papier de Cuisson",
  },
  {
    id: "greaseproof-paper",
    nameEn: "Greaseproof Paper (PFOS & PFOA FREE)",
    nameFr: "Papier Antigras (Sans PFOS & PFOA)",
    descriptionEn:
      "Made of 100% virgin wood pulp. Grease-proof, waterproof, and breathable. Use: fried food packaging (fries, tempura, chicken nuggets). Formats: retail rolls, sheets, round sheets, paper bags. Customization available.",
    descriptionFr:
      "Fabriqu\u00e9 \u00e0 partir de 100% de p\u00e2te de bois vierge. R\u00e9sistant aux graisses, imperm\u00e9able et respirant. Usage\u00a0: emballage d\u2019aliments frits. Formats\u00a0: rouleaux, feuilles, sacs en papier. Personnalisation disponible.",
    categoryEn: "Greaseproof",
    categoryFr: "Antigras",
  },
  {
    id: "wax-paper",
    nameEn: "Wax Paper",
    nameFr: "Papier Cir\u00e9",
    descriptionEn:
      "100% virgin wood pulp, waxed on one or both sides per customer requirements. Use: fruit and vegetable packaging. Formats: retail rolls, sheets, round sheets, paper bags. Packaging per customer needs.",
    descriptionFr:
      "P\u00e2te de bois vierge 100%, cirage simple ou double face selon les besoins du client. Usage\u00a0: emballage de fruits et l\u00e9gumes. Formats\u00a0: rouleaux, feuilles, sacs en papier. Conditionnement selon besoins.",
    categoryEn: "Wax Paper",
    categoryFr: "Papier Cir\u00e9",
  },
  {
    id: "butcher-paper",
    nameEn: "Butcher Paper",
    nameFr: "Papier Boucher",
    descriptionEn:
      "Base paper made from whole virgin wood pulp. Strong water resistance and high paper strength for meat and seafood. Use: meat charcoal roasting, baking, smoking. Size customization available for multiple product types.",
    descriptionFr:
      "Papier de base en p\u00e2te de bois vierge. Grande r\u00e9sistance \u00e0 l\u2019eau et haute r\u00e9sistance m\u00e9canique pour viandes et fruits de mer. Usage\u00a0: grillade, cuisson, fumage. Personnalisation des dimensions disponible.",
    categoryEn: "Butcher Paper",
    categoryFr: "Papier Boucher",
  },
  {
    id: "freezer-paper",
    nameEn: "Freezer Paper",
    nameFr: "Papier Cong\u00e9lateur",
    descriptionEn:
      "Made from whole virgin wood pulp. Suitable for -23\u00b0C to 80\u00b0C with waterproof and oil-proof functions. Use: meats, seafood, vegetables, fruits, pizza dough, flower dough. Formats: sheets, rolls, boxes.",
    descriptionFr:
      "Fabriqu\u00e9 en p\u00e2te de bois vierge. Adapt\u00e9 de -23\u00b0C \u00e0 80\u00b0C, imperm\u00e9able et r\u00e9sistant \u00e0 l\u2019huile. Usage\u00a0: viandes, fruits de mer, l\u00e9gumes, p\u00e2tes. Formats\u00a0: feuilles, rouleaux, bo\u00eetes.",
    categoryEn: "Freezer Paper",
    categoryFr: "Papier Cong\u00e9lateur",
  },
  {
    id: "bacon-paper",
    nameEn: "Bacon Paper",
    nameFr: "Papier Bacon",
    descriptionEn:
      "Base paper made from whole virgin wood pulp. Strong water resistance, wide temperature range, and high paper strength for bacon processing. Use: bacon, ham, and similar cured meats.",
    descriptionFr:
      "Papier de base en p\u00e2te de bois vierge. Grande r\u00e9sistance \u00e0 l\u2019eau, large plage de temp\u00e9rature et haute r\u00e9sistance pour le traitement du bacon. Usage\u00a0: bacon, jambon et charcuteries.",
    categoryEn: "Bacon Paper",
    categoryFr: "Papier Bacon",
  },
];

export default function Shop() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-dark py-16 px-6 text-center">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl text-white mb-3">
          {t("shop_title")}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mb-4" />
        <p className="text-gray-400 font-body">{t("shop_sub")}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Catalog Notice Banner */}
        <div className="mb-8 flex items-start gap-3 border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-body leading-relaxed">
            {t("shop_catalog_notice")}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATALOG_PRODUCTS.map((p, i) => {
            const name = lang === "fr" ? p.nameFr : p.nameEn;
            const desc = lang === "fr" ? p.descriptionFr : p.descriptionEn;
            const category = lang === "fr" ? p.categoryFr : p.categoryEn;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border border-gray-200 group"
                data-ocid={`shop.item.${i + 1}`}
              >
                {/* Placeholder Image */}
                <div className="w-full h-52 bg-gray-100 flex flex-col items-center justify-center border-b border-gray-200">
                  <svg
                    aria-label="Product image placeholder"
                    role="img"
                    className="w-10 h-10 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v15A1.5 1.5 0 0 1 20.25 21H3.75A1.5 1.5 0 0 1 2.25 19.5V4.5A1.5 1.5 0 0 1 3.75 3Z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 font-body tracking-wide">
                    Image coming soon
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-oswald text-[10px] font-bold text-brand-red uppercase tracking-widest">
                      {category}
                    </span>
                  </div>
                  <h3 className="font-oswald font-semibold text-brand-dark text-base mb-2">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 font-body leading-relaxed mb-4">
                    {desc}
                  </p>
                  <div className="flex items-center justify-end">
                    <Button
                      size="sm"
                      className="bg-brand-dark hover:bg-gray-800 text-white font-oswald text-xs font-bold tracking-widest uppercase rounded-none flex items-center gap-1.5"
                      onClick={() => navigate("/contact")}
                      data-ocid={`shop.button.${i + 1}`}
                    >
                      <Mail className="w-3 h-3" />
                      {t("prod_contact_order")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
