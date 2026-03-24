import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "../hooks/useRouter";

export default function CheckoutCancel() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center" data-ocid="checkout.panel">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-brand-red" />
        </div>
        <div className="inline-block bg-brand-dark px-4 py-1 mb-4">
          <span className="font-oswald text-xs font-bold text-white tracking-[0.25em]">
            MULTIBAKE
          </span>
        </div>
        <h1 className="font-oswald font-bold text-4xl text-brand-dark mb-4">
          {t("checkout_cancel_title")}
        </h1>
        <p className="text-gray-600 font-body leading-relaxed mb-8">
          {t("checkout_cancel_sub")}
        </p>
        <Button
          className="bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
          onClick={() => navigate("/shop")}
          data-ocid="checkout.primary_button"
        >
          {t("checkout_back_shop")}
        </Button>
      </div>
    </div>
  );
}
