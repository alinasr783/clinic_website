import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getFeaturedArticles } from "../sevices/api";
import LazyImage from "./LazyImage";
import useLocale from "../hooks/useLocale";

function formatDate(dt, lang) {
  try {
    return new Date(dt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dt;
  }
}

function ArticleCard({ article, lang }) {
  const rawTitle = lang === "ar" ? article.title_ar : article.title_en;
  const title = (rawTitle || "").trim().replace(/^["'“”«»]+|["'“”«»]+$/g, "");
  const content = lang === "ar" ? article.content_ar : article.content_en;
  const summary = useMemo(() => {
    if (!content) return "";
    const trimmed = content.replace(/\s+/g, " ").trim();
    return trimmed.length > 180 ? trimmed.slice(0, 180) + "…" : trimmed;
  }, [content]);

  return (
    <Link to={`/articles/${article.id}`} className="group">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-2 rounded-xl overflow-hidden border border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <LazyImage
            src={article.image_url || "/hero.png"}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-semibold text-light-1 tracking-tight line-clamp-2">
            {title}
          </h3>
          <p className="mt-2 text-sm md:text-base text-gray-300 line-clamp-2">
            {summary}
          </p>
          <div className="mt-3 text-xs md:text-sm text-gray-400">
            {formatDate(article.created_at, lang)}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function FeaturedArticles() {
  const { lang, setLang } = useLocale();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getFeaturedArticles(3)
      .then((data) => {
        if (active) setArticles(Array.isArray(data) ? data : []);
      })
      .catch(() => setError(lang === "ar" ? "حدث خطأ" : "Error occurred"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <section ref={ref} className="mt-3 sm:mt-4 md:mt-6">
      <div className="flex items-center justify-between gap-2">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-light-1"
        >
          {lang === "ar" ? "مقالات مميزة" : "Featured Articles"}
        </motion.h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3 py-2 rounded-lg border border-gray-700 text-light-1 hover:bg-dark-3 transition-colors"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-red-400 text-sm">{error}</div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-gray-300">
            {lang === "ar" ? "جارِ التحميل..." : "Loading..."}
          </div>
        )}
        {!loading && articles.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-gray-300">
            {lang === "ar" ? "لا توجد مقالات" : "No articles"}
          </div>
        )}
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} lang={lang} />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/articles")}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-500 text-light-1 font-semibold hover:from-gray-600 hover:to-gray-400 shadow-sm hover:shadow-md"
        >
          {lang === "ar" ? "المزيد من المقالات" : "View More Articles"}
        </motion.button>
      </div>
    </section>
  );
}
