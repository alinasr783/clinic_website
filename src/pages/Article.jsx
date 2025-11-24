import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { getAllArticles, getArticleById } from "../sevices/api";
import LazyImage from "../components/LazyImage";
import useLocale from "../hooks/useLocale";

function formatDate(dt, lang) {
  try {
    return new Date(dt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dt;
  }
}

function readingTime(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function sanitizeTitle(t) {
  if (!t) return "";
  const trimmed = t.trim();
  return trimmed.replace(/^["'“”«»]+|["'“”«»]+$/g, "");
}

function ProgressBar({ targetRef }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(el.scrollTop || window.scrollY - el.offsetTop, 0), total);
      const p = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(p);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetRef]);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-dark-3 z-50">
      <div className="h-1 bg-gray-400" style={{ width: `${progress}%` }} />
    </div>
  );
}

function Content({ text, lang }) {
  function renderInline(str) {
    const parts = [];
    let lastIndex = 0;
    const regex = /\*\*(.+?)\*\*/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      if (start > lastIndex) parts.push(str.slice(lastIndex, start));
      parts.push(
        <span key={`${start}-${end}`} className="font-semibold text-light-1 bg-dark-3 px-1 rounded">
          {match[1]}
        </span>
      );
      lastIndex = end;
    }
    if (lastIndex < str.length) parts.push(str.slice(lastIndex));
    return parts;
  }
  const blocks = useMemo(() => {
    const lines = (text || "").split(/\n+/);
    return lines.map((line, i) => {
      if (line.startsWith("### ")) return { type: "h3", content: line.replace(/^###\s*/, ""), key: i };
      if (line.startsWith("## ")) return { type: "h2", content: line.replace(/^##\s*/, ""), key: i };
      if (line.startsWith("# ")) return { type: "h1", content: line.replace(/^#\s*/, ""), key: i };
      if (line.startsWith("> ")) return { type: "quote", content: line.replace(/^>\s*/, ""), key: i };
      return { type: "p", content: line, key: i };
    });
  }, [text]);
  return (
    <div className="space-y-4 leading-relaxed text-gray-200">
      {blocks.map((b) => {
        if (b.type === "h1") return <h2 key={b.key} className="text-2xl md:text-3xl font-bold text-light-1">{renderInline(b.content)}</h2>;
        if (b.type === "h2") return <h3 key={b.key} className="text-xl md:text-2xl font-semibold text-light-1">{renderInline(b.content)}</h3>;
        if (b.type === "h3") return <h4 key={b.key} className="text-lg md:text-xl font-semibold text-light-1">{renderInline(b.content)}</h4>;
        if (b.type === "quote") return <blockquote key={b.key} className="border-l-4 border-gray-500 pl-3 text-gray-300">{renderInline(b.content)}</blockquote>;
        return <p key={b.key} className="text-base md:text-lg">{renderInline(b.content)}</p>;
      })}
    </div>
  );
}

function Share({ title }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-dark-3 border border-gray-700 text-light-1">Facebook</a>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-dark-3 border border-gray-700 text-light-1">X</a>
      <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-dark-3 border border-gray-700 text-light-1">WhatsApp</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-dark-3 border border-gray-700 text-light-1">LinkedIn</a>
    </div>
  );
}

export default function Article() {
  const { id } = useParams();
  const { lang, setLang } = useLocale();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getArticleById(id), getAllArticles()])
      .then(([a, all]) => {
        if (!active) return;
        setArticle(a);
        setRelated((all || []).filter((x) => x.id !== id).slice(0, 3));
        const t = lang === "ar" ? a?.title_ar : a?.title_en;
        const d = lang === "ar" ? a?.content_ar : a?.content_en;
        document.title = t ? `${t} | Articles` : document.title;
        const meta = document.querySelector('meta[name="description"]');
        if (meta && d) meta.setAttribute('content', d.slice(0, 160));
        const ld = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: t,
          image: a?.image_url || '',
          datePublished: a?.created_at,
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(ld);
        document.head.appendChild(script);
      })
      .catch(() => setError(lang === "ar" ? "حدث خطأ" : "Error occurred"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, lang]);

  const title = lang === "ar" ? article?.title_ar : article?.title_en;
  const content = lang === "ar" ? article?.content_ar : article?.content_en;
  const rtime = readingTime(content);
  const cleanTitle = sanitizeTitle(title || "");

  function shareArticle() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = cleanTitle;
    if (navigator.share) {
      navigator.share({ title: text, url }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          toast.success(lang === "ar" ? "تم نسخ رابط المقال" : "Article link copied");
        }).catch(() => {
          toast.error(lang === "ar" ? "تعذر النسخ" : "Copy failed");
        });
      }
    }
  }

  return (
    <main ref={scrollRef} className="bg-dark-1 px-0 py-0 md:p-0 font-roboto">
      <ProgressBar targetRef={scrollRef} />
      <div className="px-3 py-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-400">
              <Link to="/" className="hover:text-light-1">Home</Link>
              <span className="mx-2">→</span>
              <Link to="/articles" className="hover:text-light-1">Articles</Link>
              <span className="mx-2">→</span>
              <span className="text-light-1">{cleanTitle}</span>
            </nav>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-2 rounded-lg border border-gray-700 text-light-1 hover:bg-dark-3"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>
          </div>
          <div className="mt-3">
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate('/articles')}
              className="px-4 py-2 rounded-lg bg-dark-3 border border-gray-700 text-light-1 hover:bg-dark-2"
            >
              {lang === "ar" ? "العودة إلى المقالات" : "Back to Articles"}
            </motion.button>
          </div>
        </div>
      </div>

      {article && (
        <div className="w-full">
          <div className="relative w-full aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
            <LazyImage
              src={article.image_url || "/hero.png"}
              alt={title || ""}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="px-3 py-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-light-1"
          >
            {cleanTitle}
          </motion.h1>
          <div className="mt-3 text-sm md:text-base text-gray-400">
            <span>{formatDate(article?.created_at, lang)}</span>
            <span className="mx-2">•</span>
            <span>{lang === "ar" ? `${rtime} دقيقة قراءة` : `${rtime} min read`}</span>
          </div>
          <div className="mt-6">
            <Content text={content || ""} lang={lang} />
          </div>
        </div>
      </div>

      <div className="px-3 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" />
          <aside className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-light-1">
              {lang === "ar" ? "مقالات ذات صلة" : "Related Articles"}
            </h3>
            <div className="mt-3 space-y-3">
              {related.map((r) => {
                const t = lang === "ar" ? r.title_ar : r.title_en;
                return (
                  <Link key={r.id} to={`/articles/${r.id}`} className="block p-3 rounded-lg bg-dark-2 border border-gray-700 hover:bg-dark-3">
                    <div className="text-light-1 font-medium line-clamp-2">{t}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatDate(r.created_at, lang)}</div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      <div className="px-3 py-6 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button onClick={shareArticle} className="px-5 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-500 text-light-1 font-semibold hover:from-gray-500 hover:to-gray-400">
              {lang === "ar" ? "مشاركة المقال" : "Share Article"}
            </button>
            <Link to="/articles" className="px-5 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-500 text-light-1 font-semibold hover:from-gray-600 hover:to-gray-400">
              {lang === "ar" ? "المزيد من المقالات" : "More Articles"}
            </Link>
          </div>
          <div className="mt-4">
            <Share title={cleanTitle} />
          </div>
        </div>
      </div>
    </main>
  );
}