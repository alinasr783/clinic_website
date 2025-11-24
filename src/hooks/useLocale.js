import { useEffect, useState } from "react";

export default function useLocale() {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem("lang");
    return stored === "en" || stored === "ar" ? stored : "en";
  });

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search).get("lang");
    if (qs === "en" || qs === "ar") setLang(qs);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return { lang, setLang };
}
