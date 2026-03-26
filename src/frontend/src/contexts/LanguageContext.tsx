import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "en" | "fr";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_shop: "Shop",
    nav_about: "About",
    nav_why: "Why MultiBake",
    nav_usecases: "Applications",
    nav_contact: "Contact",
    nav_samples: "Request Free Samples",
    nav_cart: "Cart",
    hero_pre: "PREMIUM",
    hero_title: "PARCHMENT PAPER FOR PROFESSIONAL BAKING & FOOD SERVICE",
    hero_sub:
      "100% Canadian-made. Non-stick. FDA & CFIA compliant. Trusted by bakeries and food manufacturers across North America.",
    hero_cta1: "SHOP NOW",
    hero_cta2: "GET FREE SAMPLES",
    hero_badge_left: "EST. CANADIAN BRAND",
    hero_badge_right: "FOOD SAFE | NON-STICK",
    why_title: "WHY CHOOSE MULTIBAKE",
    why_1: "100% Canadian Made",
    why_2: "High Heat Resistant",
    why_3: "Heavy Duty & Reliable",
    why_4: "Food Grade Certified",
    why_1_desc:
      "Proudly designed and sourced in Canada with local quality standards.",
    why_2_desc:
      "Withstands temperatures up to 230\u00b0C without burning or warping.",
    why_3_desc:
      "40 to 90 GSM options for light baking to industrial-scale production.",
    why_4_desc:
      "FDA and CFIA compliant. Safe for all direct food contact applications.",
    uc_title: "INDUSTRY APPLICATIONS",
    uc_1: "Commercial Bakeries",
    uc_2: "Industrial Food Service",
    uc_3: "Food Packaging",
    uc_4: "Food Service",
    uc_view: "VIEW ALL APPLICATIONS",
    prod_title: "FEATURED PRODUCTS",
    prod_add: "ADD TO CART",
    prod_contact_order: "Contact to Order",
    prod_view: "VIEW DETAILS",
    prod_sheet: "Sheets",
    prod_roll: "Roll",
    prod_instock: "In Stock",
    prod_per_box: "/ box",
    prod_per_roll: "/ roll",
    test_title: "WHAT OUR CLIENTS SAY",
    test_1_quote:
      "MultiBake transformed our production line. Zero sticking, zero waste. Our croissants release perfectly every time.",
    test_1_name: "Marie Tremblay",
    test_1_role: "Head Baker, La Boulangerie Royale, Montreal",
    test_2_quote:
      "We switched from a US supplier and the quality difference is night and day. The 60 GSM sheets handle our heavy pastry loads without a problem.",
    test_2_name: "James O'Brien",
    test_2_role: "Production Manager, Prairie Foods Ltd., Calgary",
    test_3_quote:
      "Lead times are great and the non-stick performance at 220\u00b0C is unmatched. Our deli wraps stay clean and the meat doesn't stick \u2013 game changer.",
    test_3_name: "Sophie Bouchard",
    test_3_role: "Food Safety Director, NorthPack Inc., Edmonton",
    cta_headline: "ELEVATE YOUR KITCHEN. START NOW.",
    cta_samples: "Request Free Samples",
    cta_catalog: "Explore Our Catalog",
    footer_tagline:
      "Premium parchment paper for every professional kitchen and food production line.",
    footer_quick: "Quick Links",
    footer_products: "Products",
    footer_support: "Support",
    footer_contact_col: "Contact Us",
    about_title: "ABOUT MULTIBAKE",
    about_sub: "A Canadian company built on quality, safety, and performance.",
    about_story_title: "OUR STORY",
    about_story:
      "MultiBake was founded with a single mission: to bring world-class parchment paper to Canadian bakeries and food producers. After years of watching local businesses overpay for imported paper that couldn't withstand high-heat commercial ovens, our founders set out to create a domestic solution.",
    about_story2:
      "Today, MultiBake is trusted by hundreds of bakeries, industrial food service operations, and food packaging companies across Canada and the United States. Every roll and sheet is engineered to perform in the most demanding environments.",
    about_specs_title: "PRODUCT SPECIFICATIONS",
    about_spec_weight: "Paper Weight",
    about_spec_temp: "Max Temperature",
    about_spec_cert: "Certifications",
    about_spec_origin: "Origin",
    about_spec_weight_val: "40 GSM / 60 GSM / 90 GSM",
    about_spec_temp_val: "Up to 230\u00b0C (446\u00b0F)",
    about_spec_cert_val: "FDA & CFIA Compliant",
    about_spec_origin_val: "100% Canadian Made",
    uc_page_title: "APPLICATIONS",
    uc_page_sub:
      "From neighbourhood bakeries to industrial food production \u2013 MultiBake performs everywhere.",
    uc_bakery_title: "BAKERY",
    uc_bakery_benefit: "No oil needed + faster cleanup",
    uc_industrial_title: "INDUSTRIAL",
    uc_industrial_benefit: "Consistency + reduced waste",
    uc_foodservice_title: "FOOD SERVICE",
    uc_foodservice_benefit: "Grease resistance + food safety",
    uc_packaging_title: "FOOD PACKAGING",
    uc_packaging_benefit: "Moisture resistance + clean separation",
    uc_key_benefit: "KEY BENEFIT:",
    contact_title: "CONTACT US",
    contact_sub:
      "Get in touch for samples, bulk orders, or any questions about our products.",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_company: "Company Name",
    contact_phone: "Phone Number",
    contact_message: "Message",
    contact_submit: "SEND MESSAGE",
    contact_submitting: "Sending...",
    contact_success:
      "Your message has been sent! We will get back to you shortly.",
    contact_error: "Something went wrong. Please try again.",
    contact_info_title: "GET IN TOUCH",
    contact_phone_label: "Phone",
    contact_rep: "Sales Representative",
    shop_title: "OUR PRODUCTS",
    shop_sub: "Professional-grade parchment paper for every application.",
    shop_catalog_notice:
      "Online ordering is temporarily unavailable. Please contact us for orders, pricing, and samples.",
    shop_checkout: "PROCEED TO CHECKOUT",
    shop_cart_empty: "Your cart is empty.",
    shop_total: "Total",
    shop_items: "items",
    shop_qty: "Qty",
    shop_remove: "Remove",
    shop_no_products: "No products available at the moment.",
    checkout_success_title: "ORDER CONFIRMED!",
    checkout_success_sub:
      "Thank you for your order. We will process it and be in touch shortly.",
    checkout_cancel_title: "ORDER CANCELLED",
    checkout_cancel_sub:
      "Your order was cancelled. Feel free to continue shopping.",
    checkout_back_shop: "BACK TO SHOP",
    checkout_order_id: "Order Reference",
  },
  fr: {
    nav_shop: "Boutique",
    nav_about: "\u00c0 Propos",
    nav_why: "Pourquoi MultiBake",
    nav_usecases: "Applications",
    nav_contact: "Contact",
    nav_samples: "\u00c9chantillons Gratuits",
    nav_cart: "Panier",
    hero_pre: "PAPIER PARCHEMIN",
    hero_title:
      "DE QUALIT\u00c9 PROFESSIONNELLE POUR LA BOULANGERIE ET L'ALIMENTATION",
    hero_sub:
      "100% fabriqu\u00e9 au Canada. Antiadh\u00e9sif. Conforme FDA et ACIA. Approuv\u00e9 par les boulangeries et fabricants alimentaires en Am\u00e9rique du Nord.",
    hero_cta1: "ACHETER MAINTENANT",
    hero_cta2: "\u00c9CHANTILLONS GRATUITS",
    hero_badge_left: "MARQUE CANADIENNE",
    hero_badge_right: "SANS DANGER ALIMENTAIRE | ANTIADH\u00c9SIF",
    why_title: "POURQUOI CHOISIR MULTIBAKE",
    why_1: "100% Fabriqu\u00e9 au Canada",
    why_2: "R\u00e9sistant \u00e0 la Haute Chaleur",
    why_3: "Robuste et Fiable",
    why_4: "Certifi\u00e9 Grade Alimentaire",
    why_1_desc:
      "Fi\u00e8rement con\u00e7u et sourc\u00e9 au Canada selon des normes de qualit\u00e9 locales.",
    why_2_desc:
      "R\u00e9siste \u00e0 des temp\u00e9ratures jusqu'\u00e0 230\u00b0C sans br\u00fbler ni se d\u00e9former.",
    why_3_desc:
      "Options de 40 \u00e0 90 GSM pour la cuisson l\u00e9g\u00e8re \u00e0 la production industrielle.",
    why_4_desc:
      "Conforme FDA et ACIA. S\u00e9curitaire pour tout contact alimentaire direct.",
    uc_title: "APPLICATIONS PAR INDUSTRIE",
    uc_1: "Boulangeries Commerciales",
    uc_2: "Service Alimentaire Industriel",
    uc_3: "Emballage Alimentaire",
    uc_4: "Service Alimentaire",
    uc_view: "VOIR TOUTES LES APPLICATIONS",
    prod_title: "PRODUITS VEDETTES",
    prod_add: "AJOUTER AU PANIER",
    prod_contact_order: "Contacter pour Commander",
    prod_view: "VOIR LES D\u00c9TAILS",
    prod_sheet: "Feuilles",
    prod_roll: "Rouleau",
    prod_instock: "En Stock",
    prod_per_box: "/ bo\u00eete",
    prod_per_roll: "/ rouleau",
    test_title: "CE QUE NOS CLIENTS DISENT",
    test_1_quote:
      "MultiBake a transform\u00e9 notre ligne de production. Aucun collage, aucun gaspillage. Nos croissants se d\u00e9collent parfaitement \u00e0 chaque fois.",
    test_1_name: "Marie Tremblay",
    test_1_role:
      "Boulang\u00e8re en chef, La Boulangerie Royale, Montr\u00e9al",
    test_2_quote:
      "Nous avons chang\u00e9 de fournisseur am\u00e9ricain et la diff\u00e9rence de qualit\u00e9 est remarquable. Les feuilles 60 GSM supportent nos charges lourdes sans probl\u00e8me.",
    test_2_name: "James O'Brien",
    test_2_role: "Directeur de production, Prairie Foods Ltd., Calgary",
    test_3_quote:
      "Les d\u00e9lais de livraison sont excellents et les performances antiadh\u00e9sives \u00e0 220\u00b0C sont in\u00e9gal\u00e9es. Nos emballages de charcuterie restent propres \u2014 un vrai changement.",
    test_3_name: "Sophie Bouchard",
    test_3_role:
      "Directrice de la s\u00e9curit\u00e9 alimentaire, NorthPack Inc., Edmonton",
    cta_headline: "\u00c9LEVEZ VOTRE CUISINE. COMMENCEZ MAINTENANT.",
    cta_samples: "Demander des \u00c9chantillons Gratuits",
    cta_catalog: "Explorer Notre Catalogue",
    footer_tagline:
      "Papier parchemin de qualit\u00e9 sup\u00e9rieure pour chaque cuisine professionnelle et ligne de production alimentaire.",
    footer_quick: "Liens Rapides",
    footer_products: "Produits",
    footer_support: "Support",
    footer_contact_col: "Nous Contacter",
    about_title: "\u00c0 PROPOS DE MULTIBAKE",
    about_sub:
      "Une entreprise canadienne fond\u00e9e sur la qualit\u00e9, la s\u00e9curit\u00e9 et la performance.",
    about_story_title: "NOTRE HISTOIRE",
    about_story:
      "MultiBake a \u00e9t\u00e9 fond\u00e9e avec une seule mission : apporter un papier parchemin de classe mondiale aux boulangeries et producteurs alimentaires canadiens.",
    about_story2:
      "Aujourd'hui, MultiBake est approuv\u00e9 par des centaines de boulangeries, op\u00e9rations de service alimentaire industriel et entreprises d'emballage alimentaire \u00e0 travers le Canada et les \u00c9tats-Unis.",
    about_specs_title: "SP\u00c9CIFICATIONS DES PRODUITS",
    about_spec_weight: "Poids du Papier",
    about_spec_temp: "Temp\u00e9rature Maximale",
    about_spec_cert: "Certifications",
    about_spec_origin: "Origine",
    about_spec_weight_val: "40 GSM / 60 GSM / 90 GSM",
    about_spec_temp_val: "Jusqu'\u00e0 230\u00b0C (446\u00b0F)",
    about_spec_cert_val: "Conforme FDA & ACIA",
    about_spec_origin_val: "100% Fabriqu\u00e9 au Canada",
    uc_page_title: "APPLICATIONS",
    uc_page_sub:
      "De la boulangerie de quartier \u00e0 la production alimentaire industrielle \u2013 MultiBake performe partout.",
    uc_bakery_title: "BOULANGERIE",
    uc_bakery_benefit: "Aucune huile n\u00e9cessaire + nettoyage rapide",
    uc_industrial_title: "INDUSTRIEL",
    uc_industrial_benefit: "Constance + r\u00e9duction du gaspillage",
    uc_foodservice_title: "SERVICE ALIMENTAIRE",
    uc_foodservice_benefit:
      "R\u00e9sistance aux graisses + s\u00e9curit\u00e9 alimentaire",
    uc_packaging_title: "EMBALLAGE ALIMENTAIRE",
    uc_packaging_benefit:
      "R\u00e9sistance \u00e0 l'humidit\u00e9 + s\u00e9paration propre",
    uc_key_benefit: "AVANTAGE CL\u00c9 :",
    contact_title: "CONTACTEZ-NOUS",
    contact_sub:
      "Contactez-nous pour des \u00e9chantillons, des commandes en gros ou toute question sur nos produits.",
    contact_name: "Nom Complet",
    contact_email: "Adresse Courriel",
    contact_company: "Nom de l'Entreprise",
    contact_phone: "Num\u00e9ro de T\u00e9l\u00e9phone",
    contact_message: "Message",
    contact_submit: "ENVOYER LE MESSAGE",
    contact_submitting: "Envoi en cours...",
    contact_success:
      "Votre message a \u00e9t\u00e9 envoy\u00e9 ! Nous vous contacterons sous peu.",
    contact_error: "Une erreur s'est produite. Veuillez r\u00e9essayer.",
    contact_info_title: "NOUS JOINDRE",
    contact_phone_label: "T\u00e9l\u00e9phone",
    contact_rep: "Repr\u00e9sentant des Ventes",
    shop_title: "NOS PRODUITS",
    shop_sub:
      "Papier parchemin de qualit\u00e9 professionnelle pour chaque application.",
    shop_catalog_notice:
      "La commande en ligne est temporairement indisponible. Veuillez nous contacter pour les commandes, les prix et les \u00e9chantillons.",
    shop_checkout: "PASSER \u00c0 LA CAISSE",
    shop_cart_empty: "Votre panier est vide.",
    shop_total: "Total",
    shop_items: "articles",
    shop_qty: "Qt\u00e9",
    shop_remove: "Supprimer",
    shop_no_products: "Aucun produit disponible pour le moment.",
    checkout_success_title: "COMMANDE CONFIRM\u00c9E !",
    checkout_success_sub:
      "Merci pour votre commande. Nous la traiterons et vous contacterons sous peu.",
    checkout_cancel_title: "COMMANDE ANNUL\u00c9E",
    checkout_cancel_sub:
      "Votre commande a \u00e9t\u00e9 annul\u00e9e. N'h\u00e9sitez pas \u00e0 continuer vos achats.",
    checkout_back_shop: "RETOUR \u00c0 LA BOUTIQUE",
    checkout_order_id: "R\u00e9f\u00e9rence de Commande",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("multibake_lang");
    return (stored === "fr" || stored === "en" ? stored : "en") as Language;
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("multibake_lang", l);
  };

  const t = (key: string) =>
    translations[lang][key] ?? translations.en[key] ?? key;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
