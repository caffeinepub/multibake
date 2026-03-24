import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useStripeSessionStatus } from "../hooks/useQueries";
import { useNavigate, useSearchParams } from "../hooks/useRouter";

export default function CheckoutSuccess() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data: status, isLoading } = useStripeSessionStatus(sessionId);

  return (
    <div className="bg-white min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center" data-ocid="checkout.panel">
        {isLoading ? (
          <div
            className="flex flex-col items-center gap-4"
            data-ocid="checkout.loading_state"
          >
            <Loader2 className="w-12 h-12 animate-spin text-brand-red" />
            <p className="font-oswald text-brand-dark tracking-widest">
              PROCESSING ORDER...
            </p>
          </div>
        ) : status?.__kind__ === "failed" ? (
          <div data-ocid="checkout.error_state">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-brand-red" />
            </div>
            <h1 className="font-oswald font-bold text-3xl text-brand-dark mb-4">
              PAYMENT ISSUE
            </h1>
            <p className="text-gray-600 font-body mb-8">
              {status.failed.error}
            </p>
            <Button
              className="bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
              onClick={() => navigate("/shop")}
              data-ocid="checkout.primary_button"
            >
              {t("checkout_back_shop")}
            </Button>
          </div>
        ) : (
          <div data-ocid="checkout.success_state">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div className="inline-block bg-brand-red px-4 py-1 mb-4">
              <span className="font-oswald text-xs font-bold text-white tracking-[0.25em]">
                MULTIBAKE
              </span>
            </div>
            <h1 className="font-oswald font-bold text-4xl text-brand-dark mb-4">
              {t("checkout_success_title")}
            </h1>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              {t("checkout_success_sub")}
            </p>
            {sessionId && (
              <p className="text-xs text-gray-400 font-body mb-8">
                {t("checkout_order_id")}:{" "}
                <span className="font-mono">{sessionId.slice(0, 20)}...</span>
              </p>
            )}
            <Button
              className="bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none px-8 py-3 h-auto"
              onClick={() => navigate("/shop")}
              data-ocid="checkout.primary_button"
            >
              {t("checkout_back_shop")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
