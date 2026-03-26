import {
  Award,
  CheckCircle,
  Leaf,
  MapPin,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

const ABOUT_CHECKLIST = [
  "40 GSM standard, 60 GSM heavy duty, 90 GSM industrial grades",
  "Silicone-coated both sides for maximum non-stick performance",
  "Compliant with FDA 21 CFR 176.170 and CFIA regulations",
  "Available in custom sizes for OEM and B2B orders",
  "FDA, CFIA & Australian Standards Compliant",
];

export default function About() {
  const { t } = useLanguage();

  const specs = [
    {
      label: t("about_spec_weight"),
      value: t("about_spec_weight_val"),
      icon: <Leaf className="w-5 h-5" />,
    },
    {
      label: t("about_spec_temp"),
      value: t("about_spec_temp_val"),
      icon: <Thermometer className="w-5 h-5" />,
    },
    {
      label: t("about_spec_cert"),
      value: t("about_spec_cert_val"),
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: t("about_spec_origin"),
      value: t("about_spec_origin_val"),
      icon: <MapPin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-brand-dark py-16 px-6 text-center">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl text-white mb-3">
          {t("about_title")}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mb-4" />
        <p className="text-gray-400 font-body text-lg">{t("about_sub")}</p>
      </div>

      {/* Brand Image + Story */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="border-4 border-brand-red overflow-hidden">
            <img
              src="/assets/generated/multibake-parchment-product.dim_800x600.jpg"
              alt="MultiBake Parchment Paper Product"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-oswald font-bold text-3xl text-brand-dark mb-4">
            {t("about_story_title")}
          </h2>
          <div className="w-12 h-1 bg-brand-red mb-6" />
          <p className="text-gray-600 font-body leading-relaxed mb-4">
            {t("about_story")}
          </p>
          <p className="text-gray-600 font-body leading-relaxed mb-6">
            {t("about_story2")}
          </p>
          <div className="space-y-3">
            {ABOUT_CHECKLIST.map((item, i) => (
              <div key={item} className="flex items-start gap-3">
                {i === ABOUT_CHECKLIST.length - 1 ? (
                  <ShieldCheck className="w-5 h-5 text-brand-red mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-brand-red mt-0.5 shrink-0" />
                )}
                <span className="text-sm text-gray-600 font-body">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Specs */}
      <section className="bg-brand-gray py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-oswald font-bold text-3xl text-brand-dark mb-3">
              {t("about_specs_title")}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {specs.map((spec) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-gray-200 p-6 text-center"
              >
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red mx-auto mb-4">
                  {spec.icon}
                </div>
                <div className="font-oswald font-bold text-brand-red text-base mb-1">
                  {spec.value}
                </div>
                <div className="font-oswald text-xs text-gray-500 uppercase tracking-widest">
                  {spec.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Production images */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="overflow-hidden">
            <img
              src="/assets/uploads/chatgpt_image_mar_24_2026_at_05_59_28_pm-019d21dc-6d27-7518-885a-29eec025f797-2.png"
              alt="Commercial Bakery"
              className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src="/assets/generated/use-case-industrial.dim_800x600.jpg"
              alt="Industrial Food Service"
              className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
