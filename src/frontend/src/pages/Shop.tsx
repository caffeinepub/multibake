import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useCreateCheckoutSession,
  useProductCatalog,
} from "../hooks/useQueries";
import { useNavigate } from "../hooks/useRouter";

type SeedProduct = {
  sku: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  priceCents: bigint;
  category: string;
  stock: bigint;
  image: string;
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    sku: "MB-SHEET-40",
    nameEn: "Premium Baking Sheets 40 GSM",
    nameFr: "Feuilles de Cuisson Premium 40 GSM",
    descriptionEn:
      "Professional-grade silicone-coated parchment sheets. Non-stick, heat-resistant up to 230\u00b0C.",
    descriptionFr:
      "Feuilles parchemin enduites de silicone de qualit\u00e9 professionnelle. Antiadh\u00e9sif.",
    priceCents: BigInt(4500),
    category: "sheet",
    stock: BigInt(100),
    image: "/assets/generated/product-sheets-40gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-ROLL-40",
    nameEn: "Standard Baking Roll 40 GSM",
    nameFr: "Rouleau de Cuisson Standard 40 GSM",
    descriptionEn:
      "Versatile standard roll for everyday commercial baking. Excellent non-stick performance.",
    descriptionFr:
      "Rouleau standard polyvalent pour la cuisson commerciale quotidienne.",
    priceCents: BigInt(3800),
    category: "roll",
    stock: BigInt(100),
    image: "/assets/generated/product-roll-40gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-SHEET-60",
    nameEn: "Heavy Duty Sheets 60 GSM",
    nameFr: "Feuilles Robustes 60 GSM",
    descriptionEn:
      "Heavy duty sheets for high-volume bakeries and industrial applications.",
    descriptionFr:
      "Feuilles robustes pour les boulangeries \u00e0 haut volume.",
    priceCents: BigInt(6500),
    category: "sheet",
    stock: BigInt(100),
    image: "/assets/generated/product-sheets-60gsm.dim_600x500.jpg",
  },
  {
    sku: "MB-ROLL-90",
    nameEn: "Industrial Roll 90 GSM",
    nameFr: "Rouleau Industriel 90 GSM",
    descriptionEn:
      "Heaviest grade roll for industrial production lines and conveyor systems.",
    descriptionFr:
      "Rouleau de grade le plus lourd pour les lignes de production industrielles.",
    priceCents: BigInt(8900),
    category: "roll",
    stock: BigInt(100),
    image: "/assets/generated/product-roll-90gsm.dim_600x500.jpg",
  },
];

export default function Shop() {
  const { t, lang } = useLanguage();
  const { data: catalogData, isLoading } = useProductCatalog();
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalCents,
  } = useCart();
  const createCheckout = useCreateCheckoutSession();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const products: SeedProduct[] =
    catalogData && catalogData.length > 0
      ? catalogData.map((p, i) => ({
          sku: p.sku,
          nameEn: p.nameEn,
          nameFr: p.nameFr,
          descriptionEn: SEED_PRODUCTS[i % SEED_PRODUCTS.length].descriptionEn,
          descriptionFr: SEED_PRODUCTS[i % SEED_PRODUCTS.length].descriptionFr,
          priceCents: p.priceCents,
          category: String(p.category),
          stock: p.stock,
          image: SEED_PRODUCTS[i % SEED_PRODUCTS.length].image,
        }))
      : SEED_PRODUCTS;

  const handleAdd = (p: SeedProduct) => {
    const name = lang === "fr" ? p.nameFr : p.nameEn;
    addItem({
      sku: p.sku,
      name,
      priceCents: Number(p.priceCents),
      image: p.image,
      unit: p.category === "roll" ? t("prod_per_roll") : t("prod_per_box"),
    });
    toast.success(
      lang === "fr" ? `${name} ajout\u00e9 au panier` : `${name} added to cart`,
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckingOut(true);
    try {
      const origin = window.location.origin;
      const url = await createCheckout.mutateAsync({
        items: cartItems.map((item) => ({
          productName: item.name,
          currency: "cad",
          quantity: BigInt(item.quantity),
          priceInCents: BigInt(item.priceCents),
          productDescription: "MultiBake Premium Parchment Paper",
        })),
        successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/checkout/cancel`,
      });

      if (!url || !url.startsWith("http")) {
        throw new Error("Invalid checkout URL returned");
      }

      clearCart();
      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const isNotConfigured =
        message.toLowerCase().includes("not configured") ||
        message.toLowerCase().includes("stripe") ||
        message.toLowerCase().includes("key") ||
        message.toLowerCase().includes("invalid checkout url");

      if (isNotConfigured) {
        toast.error(
          lang === "fr"
            ? "Le paiement en ligne n'est pas encore activ\u00e9. Contactez-nous pour passer votre commande."
            : "Online payment is not yet active. Please contact us to place your order.",
          { duration: 6000 },
        );
      } else {
        toast.error(
          lang === "fr"
            ? "Erreur lors du paiement. Veuillez r\u00e9essayer."
            : "Checkout failed. Please try again.",
        );
      }
      setCheckingOut(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-dark py-16 px-6 text-center">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl text-white mb-3">
          {t("shop_title")}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mb-4" />
        <p className="text-gray-400 font-body">{t("shop_sub")}</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div
                className="flex items-center justify-center py-20"
                data-ocid="shop.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              </div>
            ) : products.length === 0 ? (
              <div
                className="text-center py-20 text-gray-500 font-body"
                data-ocid="shop.empty_state"
              >
                {t("shop_no_products")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((p, i) => {
                  const name = lang === "fr" ? p.nameFr : p.nameEn;
                  const desc =
                    lang === "fr" ? p.descriptionFr : p.descriptionEn;
                  const price = Number(p.priceCents);
                  const isRoll = p.category === "roll";
                  return (
                    <motion.div
                      key={p.sku}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="border border-gray-200 group"
                      data-ocid={`shop.item.${i + 1}`}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={p.image}
                          alt={name}
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-oswald text-[10px] font-bold text-brand-red uppercase tracking-widest">
                            {isRoll ? t("prod_roll") : t("prod_sheet")}
                          </span>
                          <span className="text-xs text-green-600 font-body font-medium">
                            {t("prod_instock")}
                          </span>
                        </div>
                        <h3 className="font-oswald font-semibold text-brand-dark text-base mb-2">
                          {name}
                        </h3>
                        <p className="text-xs text-gray-500 font-body leading-relaxed mb-4">
                          {desc}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="font-oswald font-bold text-brand-red text-2xl">
                            ${(price / 100).toFixed(2)}
                            <span className="text-xs font-normal text-gray-400 ml-1">
                              {isRoll ? t("prod_per_roll") : t("prod_per_box")}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-brand-red hover:bg-red-800 text-white font-oswald text-xs font-bold tracking-widest uppercase rounded-none"
                            onClick={() => handleAdd(p)}
                            data-ocid={`shop.button.${i + 1}`}
                          >
                            {t("prod_add")}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 border-2 border-brand-dark"
              data-ocid="shop.panel"
            >
              <div className="bg-brand-dark px-5 py-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-red" />
                <span className="font-oswald font-bold text-white tracking-widest text-sm uppercase">
                  {t("nav_cart")}
                </span>
                {cartItems.length > 0 && (
                  <span className="ml-auto bg-brand-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((s, item) => s + item.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="p-5">
                {cartItems.length === 0 ? (
                  <p
                    className="text-gray-500 text-sm font-body text-center py-8"
                    data-ocid="shop.empty_state"
                  >
                    {t("shop_cart_empty")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, i) => (
                      <div
                        key={item.sku}
                        className="flex gap-3"
                        data-ocid={`cart.item.${i + 1}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-oswald text-xs font-semibold text-brand-dark leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-brand-red font-oswald font-bold text-sm mt-0.5">
                            ${(item.priceCents / 100).toFixed(2)}
                            {item.unit}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.sku, item.quantity - 1)
                              }
                              className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              data-ocid={`cart.button.${i + 1}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-body text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.sku, item.quantity + 1)
                              }
                              className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              data-ocid={`cart.button.${i + 1}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.sku)}
                              className="ml-auto text-gray-400 hover:text-brand-red"
                              data-ocid={`cart.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between font-oswald font-bold text-brand-dark">
                      <span className="uppercase tracking-widest text-sm">
                        {t("shop_total")}
                      </span>
                      <span className="text-brand-red text-xl">
                        ${(totalCents / 100).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none"
                      onClick={handleCheckout}
                      disabled={checkingOut}
                      data-ocid="shop.submit_button"
                    >
                      {checkingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {t("shop_checkout")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 lg:hidden" data-ocid="shop.button">
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-brand-red text-white font-oswald font-bold text-sm rounded-full w-14 h-14 flex items-center justify-center shadow-heavy"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-brand-red text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartItems.reduce((s, item) => s + item.quantity, 0)}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
