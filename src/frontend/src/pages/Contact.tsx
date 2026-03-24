import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSubmitLead } from "../hooks/useQueries";

export default function Contact() {
  const { t, lang } = useLanguage();
  const submitLead = useSubmitLead();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await submitLead.mutateAsync({
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone,
        message: form.message,
        language: lang,
        timestamp: BigInt(Date.now()),
      });
      setSubmitted(true);
    } catch {
      setError(t("contact_error"));
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-brand-dark py-16 px-6 text-center">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl text-white mb-3">
          {t("contact_title")}
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto mb-4" />
        <p className="text-gray-400 font-body">{t("contact_sub")}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="font-oswald font-bold text-2xl text-brand-dark mb-4">
            {t("contact_info_title")}
          </h2>
          <div className="w-10 h-1 bg-brand-red mb-6" />
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-oswald font-semibold text-brand-dark text-sm uppercase tracking-widest mb-0.5">
                  {t("contact_phone_label")}
                </div>
                <div className="text-gray-600 font-body text-sm">
                  514-641-4422
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-oswald font-semibold text-brand-dark text-sm uppercase tracking-widest mb-0.5">
                  Email
                </div>
                <a
                  href="mailto:info@multibake.ca"
                  className="text-brand-red font-body text-sm hover:underline"
                >
                  info@multibake.ca
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-oswald font-semibold text-brand-dark text-sm uppercase tracking-widest mb-0.5">
                  Location
                </div>
                <div className="text-gray-600 font-body text-sm">
                  2001 Boul. des Sources, Pointe-Claire, QC H9R 5Z4
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="contact.success_state"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-oswald font-bold text-2xl text-brand-dark">
                {lang === "fr" ? "MESSAGE ENVOY\u00c9 !" : "MESSAGE SENT!"}
              </h3>
              <p className="text-gray-600 font-body text-center max-w-sm">
                {t("contact_success")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="contact.panel"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="font-oswald text-xs font-semibold tracking-widest uppercase text-brand-dark"
                  >
                    {t("contact_name")} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-none border-gray-300 font-body"
                    data-ocid="contact.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="font-oswald text-xs font-semibold tracking-widest uppercase text-brand-dark"
                  >
                    {t("contact_email")} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-none border-gray-300 font-body"
                    data-ocid="contact.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company"
                    className="font-oswald text-xs font-semibold tracking-widest uppercase text-brand-dark"
                  >
                    {t("contact_company")}
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="rounded-none border-gray-300 font-body"
                    data-ocid="contact.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="font-oswald text-xs font-semibold tracking-widest uppercase text-brand-dark"
                  >
                    {t("contact_phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="rounded-none border-gray-300 font-body"
                    data-ocid="contact.input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="message"
                  className="font-oswald text-xs font-semibold tracking-widest uppercase text-brand-dark"
                >
                  {t("contact_message")} *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="rounded-none border-gray-300 font-body"
                  data-ocid="contact.textarea"
                />
              </div>
              {error && (
                <p
                  className="text-brand-red text-sm font-body"
                  data-ocid="contact.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={submitLead.isPending}
                className="w-full bg-brand-red hover:bg-red-800 text-white font-oswald font-bold tracking-widest text-sm uppercase rounded-none py-3 h-auto"
                data-ocid="contact.submit_button"
              >
                {submitLead.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {t("contact_submitting")}
                  </>
                ) : (
                  t("contact_submit")
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
