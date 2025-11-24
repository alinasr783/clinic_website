import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllArticles } from "../sevices/api";
import LazyImage from "../components/LazyImage";
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

export default function ArticlesList() {
  const { lang, setLang } = useLocale();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllArticles()
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
    <main className="bg-dark-1 px-3 py-4 md:p-6 font-roboto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-light-1">
            {lang === "ar" ? "كل المقالات" : "All Articles"}
          </h1>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3 py-2 rounded-lg border border-gray-700 text-light-1 hover:bg-dark-3"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-red-400 text-sm">{error}</div>
        )}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
          {articles.map((a, idx) => {
            const rawTitle = lang === "ar" ? a.title_ar : a.title_en;
            const title = (rawTitle || "").trim().replace(/^["'“”«»]+|["'“”«»]+$/g, "");
            const content = lang === "ar" ? a.content_ar : a.content_en;
            const summary = content?.replace(/\s+/g, " ").trim();
            const short = summary && summary.length > 160 ? summary.slice(0, 160) + "…" : summary;
            return (
              <Link key={a.id} to={`/articles/${a.id}`} className="group">
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="bg-dark-2 rounded-xl overflow-hidden border border-gray-700 shadow-sm hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <LazyImage
                      src={a.image_url || "/hero.png"}
                      alt={title}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-lg md:text-xl font-semibold text-light-1 tracking-tight line-clamp-2">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm md:text-base text-gray-300 line-clamp-2">
                      {short}
                    </p>
                    <div className="mt-3 text-xs md:text-sm text-gray-400">
                      {formatDate(a.created_at, lang)}
                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
