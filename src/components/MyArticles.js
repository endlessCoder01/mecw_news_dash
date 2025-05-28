import React, { useState, useEffect, useMemo } from "react";

// Helper for background
function AnimatedBackgroundBlobs({ dark }) {
  return (
    <svg
      style={{
        position: "absolute",
        zIndex: 0,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        transition: "filter 0.5s"
      }}
      aria-hidden="true"
    >
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0.2" />
      </filter>
      <g filter="url(#noiseFilter)" opacity={dark ? 0.10 : 0.06}>
        <ellipse
          cx="15%"
          cy="18%"
          rx="250"
          ry="180"
          fill={dark ? "#6cc3f5" : "#8dc6ff"}
        />
        <ellipse
          cx="80%"
          cy="28%"
          rx="180"
          ry="120"
          fill={dark ? "#c9a0fc" : "#b8a1ff"}
        />
        <ellipse
          cx="35%"
          cy="80%"
          rx="210"
          ry="120"
          fill={dark ? "#f6a6b2" : "#fad2cf"}
        />
      </g>
    </svg>
  );
}

const DARK_COLORS = {
  bg: "#181824",
  card: "rgba(30,31,40,0.85)",
  glass: "rgba(35,36,46,0.75)",
  accent: "#7ecfff",
  accent2: "#ffae70",
  accent3: "#c9a0fc",
  text: "#f6f6fa",
  subtext: "#b5b5d6",
  shadow: "rgba(33,32,56,0.5)",
  border: "rgba(120,120,170,0.13)"
};
const LIGHT_COLORS = {
  bg: "#f4f7fb",
  card: "rgba(255,255,255,0.85)",
  glass: "rgba(245,247,255,0.8)",
  accent: "#4184d2",
  accent2: "#fdb813",
  accent3: "#b8a1ff",
  text: "#22243d",
  subtext: "#4f5770",
  shadow: "rgba(130,170,220,0.14)",
  border: "rgba(180,200,250,0.14)"
};

function usePrefersDark() {
  const [dark, set] = useState(() =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => set(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}

const getCategories = (articles) => {
  const set = new Set();
  articles.forEach(a => a.category && set.add(a.category));
  return Array.from(set);
};

function getFeatured(articles) {
  // Featured: most recent by default
  if (articles.length === 0) return null;
  const sorted = [...articles].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return sorted[0];
}

const MyArticles = ({ articles }) => {
  const prefersDark = usePrefersDark();
  const [dark, setDark] = useState(prefersDark);
  const COLORS = dark ? DARK_COLORS : LIGHT_COLORS;

  // UI State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // For scroll-in animation on cards
  useEffect(() => {
    const cards = document.querySelectorAll(".article-glass-card");
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [articles, search, activeCategory]);

  useEffect(() => {
    document.body.style.background = COLORS.bg;
    document.body.style.transition = "background 0.5s";
  }, [dark]);

  // Filtering
  const categories = useMemo(() => getCategories(articles), [articles]);
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        article.content.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, search]);

  // Stats
  const stats = useMemo(() => {
    const total = articles.length;
    const byCategory = {};
    articles.forEach(a => {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    });
    const recent = articles.filter(a => {
      const d = new Date(a.created_at);
      return (new Date() - d) < 1000 * 60 * 60 * 24 * 7; // last 7 days
    }).length;
    return { total, byCategory, recent };
  }, [articles]);

  // Featured
  const featured = getFeatured(articles);

  // "Add New Article" CTA
  function handleAddNew() {
    alert("✨ Add New Article dialog would open here! (Demo button)");
  }

  return (
    <div className="articles-outer-wrap" style={{ background: COLORS.bg, minHeight: "100vh", position: "relative" }}>
      <AnimatedBackgroundBlobs dark={dark} />
      <button
        aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
        className="dark-toggle"
        style={{
          position: "fixed",
          top: 24,
          right: 28,
          zIndex: 21,
          border: "none",
          background: "none",
          cursor: "pointer"
        }}
        onClick={() => setDark((d) => !d)}
      >
        <span
          style={{
            display: "inline-block",
            width: 40,
            height: 40,
            borderRadius: "50%",
            boxShadow: `0 2px 8px ${COLORS.shadow}`,
            background: dark
              ? "radial-gradient(circle at 60% 30%, #22243d 65%, #7ecfff 100%)"
              : "radial-gradient(circle at 60% 30%, #fff 65%, #4184d2 100%)",
            // display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.4s"
          }}
        >
          {dark ? (
            <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M13 1a1 1 0 0 1 1 1v1.26a7 7 0 1 1-7 7V2a1 1 0 0 1 1-1h5z"
                fill="#ffe066"
              />
            </svg>
          ) : (
            <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="5" fill="#fdb813" />
              <g stroke="#fdb813" strokeWidth="2">
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="10" y1="16" x2="10" y2="19" />
                <line x1="1" y1="10" x2="4" y2="10" />
                <line x1="16" y1="10" x2="19" y2="10" />
                <line x1="4" y1="4" x2="6" y2="6" />
                <line x1="14" y1="14" x2="16" y2="16" />
                <line x1="4" y1="16" x2="6" y2="14" />
                <line x1="14" y1="6" x2="16" y2="4" />
              </g>
            </svg>
          )}
        </span>
      </button>
      <style>{`
        .articles-outer-wrap {
          font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
        }
        .my-articles-header {
          z-index: 2;
          position: relative;
          text-align: center;
          margin: 0 auto 2.5rem auto;
          padding-top: 2.6rem;
        }
        .my-articles-header h2 {
          font-size: 2.45rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: ${COLORS.text};
          margin-bottom: 0.3rem;
        }
        .my-articles-header .subtitle {
          font-size: 1.1rem;
          color: ${COLORS.subtext};
          margin-bottom: 0.5rem;
        }
        .dashboard-stats-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 2.5rem;
          z-index: 2;
          position: relative;
        }
        .dashboard-stat-card {
          min-width: 180px;
          background: ${COLORS.card};
          border-radius: 1.7rem;
          box-shadow: 0 3px 22px 0 ${COLORS.shadow}, 0 1.5px 5px 0 ${COLORS.border} inset;
          border: 1.3px solid ${COLORS.border};
          backdrop-filter: blur(8px) saturate(1.12);
          padding: 1.1rem 1.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: box-shadow 0.23s, transform 0.19s;
          cursor: pointer;
        }
        .dashboard-stat-card:hover {
          box-shadow: 0 8px 36px 0 ${COLORS.shadow}, 0 2px 8px 0 ${COLORS.border} inset;
          transform: translateY(-4px) scale(1.03);
        }
        .dashboard-stat-title {
          font-size: 0.94rem;
          color: ${COLORS.subtext};
          margin-bottom: 0.4rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .dashboard-stat-value {
          color: ${COLORS.text};
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.2rem;
        }
        .dashboard-stat-chip {
          display: inline-block;
          padding: 0.23em 0.8em;
          border-radius: 999px;
          font-size: 0.85rem;
          background: ${COLORS.accent3};
          color: #fff;
          margin-right: 0.2em;
          margin-top: 0.15em;
        }
        .filters-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.1rem;
          margin-bottom: 2.3rem;
          z-index: 2;
          position: relative;
          justify-content: center;
        }
        .category-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.4em 1.3em;
          border-radius: 999px;
          font-size: 1.03rem;
          font-weight: 600;
          background: ${COLORS.glass};
          color: ${COLORS.text};
          border: 2px solid transparent;
          margin-right: 0.5em;
          margin-bottom: 0.3em;
          cursor: pointer;
          box-shadow: 0 1.5px 5px 0 ${COLORS.border} inset;
          transition: border 0.17s, background 0.24s, color 0.17s;
          outline: none;
        }
        .category-chip.selected,
        .category-chip:focus {
          border: 2px solid ${COLORS.accent};
          background: linear-gradient(90deg, ${COLORS.accent3} 18%, ${COLORS.accent2} 92%);
          color: #fff;
        }
        .searchbar-wrap {
          display: flex;
          align-items: center;
          background: ${COLORS.card};
          border-radius: 1.2rem;
          padding: 0.4rem 1.2rem;
          box-shadow: 0 1.5px 5px 0 ${COLORS.border} inset;
          border: 1.2px solid ${COLORS.border};
          min-width: 240px;
          max-width: 400px;
        }
        .searchbar-input {
          flex: 1 1 auto;
          background: transparent;
          border: none;
          color: ${COLORS.text};
          font-size: 1.10rem;
          margin-left: 0.7rem;
          outline: none;
          padding: 0.2rem 0;
        }
        .searchbar-input::placeholder {
          color: ${COLORS.subtext};
          opacity: 0.7;
        }
        .featured-wrap {
          max-width: 700px;
          margin: 2.5rem auto 2.5rem auto;
          border-radius: 2.3rem;
          background: linear-gradient(110deg, ${COLORS.glass} 90%, ${COLORS.accent3} 130%);
          box-shadow: 0 8px 40px 0 ${COLORS.shadow}, 0 2px 8px 0 ${COLORS.border} inset;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.24s, transform 0.19s;
          position: relative;
        }
        .featured-header {
          font-size: 0.94rem;
          font-weight: 600;
          color: ${COLORS.accent2};
          margin: 1.5rem 0 0.6rem 2rem;
          letter-spacing: 0.06em;
        }
        .featured-title {
          font-size: 2.0rem;
          font-weight: 800;
          color: ${COLORS.text};
          margin: 0 2rem 0.7rem 2rem;
        }
        .featured-body {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 0;
        }
        .featured-img {
          width: 280px;
          min-width: 180px;
          height: 210px;
          object-fit: cover;
          border-radius: 0 0.7rem 0.7rem 0;
          box-shadow: 0 6px 26px 0 ${COLORS.shadow};
          transition: filter 0.32s;
        }
        .featured-content {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1.2rem 2rem 1.2rem 2rem;
        }
        .featured-category {
          background: ${COLORS.accent3};
          color: #fff;
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
          display: inline-block;
          padding: 0.17em 0.9em;
          border-radius: 999px;
          margin-bottom: 0.7em;
        }
        .featured-preview {
          color: ${COLORS.subtext};
          font-size: 1.14rem;
          margin-bottom: 0.8em;
          line-height: 1.52;
          max-height: 4.7em;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .featured-footer {
          font-size: 0.97rem;
          color: ${COLORS.accent};
          margin-top: 0.3em;
        }
        .add-article-card {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: linear-gradient(120deg, ${COLORS.accent2} 60%, ${COLORS.accent3} 140%);
          border-radius: 2.2rem;
          min-height: 310px;
          box-shadow: 0 4px 28px 0 ${COLORS.shadow}, 0 1.5px 5px 0 ${COLORS.border} inset;
          color: #fff;
          font-size: 1.35rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          border: 2px dashed #fff5;
          transition: box-shadow 0.21s, transform 0.17s, border-color 0.19s;
        }
        .add-article-card:hover, .add-article-card:focus {
          box-shadow: 0 8px 40px 0 ${COLORS.shadow}, 0 2px 8px 0 ${COLORS.border} inset;
          border-color: #fff8;
          transform: translateY(-6px) scale(1.04);
        }
        .add-article-icon {
          font-size: 3.2rem;
          margin-bottom: 0.7rem;
        }
        .articles-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
          gap: 2.2rem;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2vw 3rem 2vw;
        }
        .article-glass-card {
          background: ${COLORS.glass};
          border-radius: 2.2rem;
          box-shadow:
            0 4px 28px 0 ${COLORS.shadow},
            0 1.5px 5px 0 ${COLORS.border} inset;
          border: 1.5px solid ${COLORS.border};
          backdrop-filter: blur(8.5px) saturate(1.15);
          display: flex;
          flex-direction: column;
          transition:
            box-shadow 0.20s cubic-bezier(.4,2,.5,1),
            transform 0.18s cubic-bezier(.4,2,.5,1),
            background 0.3s;
          opacity: 0;
          transform: translateY(40px) scale(0.97);
        }
        .article-glass-card.in-view {
          opacity: 1;
          transform: none;
          transition:
            opacity 0.7s cubic-bezier(.4,2,.5,1),
            transform 0.7s cubic-bezier(.4,2,.5,1);
        }
        .article-glass-card:hover,
        .article-glass-card:focus-within {
          box-shadow:
            0 8px 40px 0 ${COLORS.shadow},
            0 2px 8px 0 ${COLORS.border} inset;
          transform: translateY(-6px) scale(1.03);
          background: ${
            dark
              ? "rgba(42,43,58,0.93)"
              : "rgba(255,255,255,0.93)"
          };
        }
        .article-image-wrap {
          border-radius: 1.7rem 1.7rem 0 0;
          overflow: hidden;
          min-height: 170px;
          background: linear-gradient(135deg, ${COLORS.accent} 17%, transparent 100%);
        }
        .article-image {
          width: 100%;
          display: block;
          height: 200px;
          object-fit: cover;
          transition: filter 0.3s;
        }
        .article-glass-card:hover .article-image {
          filter: brightness(1.07) saturate(1.2) drop-shadow(0 2px 22px ${COLORS.shadow});
        }
        .article-content-wrap {
          flex: 1 1 auto;
          padding: 1.7rem 1.5rem 1.2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .article-title {
          color: ${COLORS.text};
          font-size: 1.28rem;
          font-weight: 700;
          margin: 0 0 0.6rem 0;
          letter-spacing: -0.01em;
        }
        .article-category {
          font-size: 0.97rem;
          color: ${COLORS.accent};
          margin-bottom: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .article-preview {
          color: ${COLORS.subtext};
          font-size: 1.01rem;
          margin-bottom: 0.8rem;
          line-height: 1.58;
          max-height: 4.7em;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .article-footer {
          padding: 0.9rem 1.5rem 1.2rem 1.5rem;
          font-size: 0.92rem;
          color: ${COLORS.subtext};
          border-top: 1px solid ${COLORS.border};
          background: transparent;
          border-radius: 0 0 1.8rem 1.8rem;
        }
        @media (max-width: 900px) {
          .featured-body {
            flex-direction: column;
          }
          .featured-img {
            width: 100%;
            border-radius: 0 0 1.1rem 1.1rem;
            height: 180px;
          }
          .featured-content {
            padding: 1.2rem 1.2rem 1.2rem 1.2rem;
          }
        }
        @media (max-width: 700px) {
          .my-articles-header h2 {
            font-size: 1.5rem;
          }
          .dashboard-stats-row {
            flex-direction: column;
            gap: 1.1rem;
          }
          .filters-row {
            flex-direction: column;
            gap: 0.7rem;
          }
          .articles-grid {
            gap: 1.2rem;
            padding: 0 0.5vw 2rem 0.5vw;
          }
          .featured-title {
            font-size: 1.16rem;
            margin: 0 1rem 0.6rem 1rem;
          }
          .featured-header,
          .featured-content {
            margin-left: 1rem;
            margin-right: 1rem;
          }
        }
      `}</style>

      <div className="my-articles-header">
        <h2>My Published Articles</h2>
        <div className="subtitle">Showcasing my latest writing journeys</div>
      </div>

      {/* DASHBOARD STATS */}
      <section className="dashboard-stats-row" aria-label="Article statistics">
        <div className="dashboard-stat-card" tabIndex={0}>
          <span className="dashboard-stat-title">Total Articles</span>
          <span className="dashboard-stat-value">{stats.total}</span>
        </div>
        <div className="dashboard-stat-card" tabIndex={0}>
          <span className="dashboard-stat-title">Published this week</span>
          <span className="dashboard-stat-value">{stats.recent}</span>
        </div>
        {categories.slice(0, 2).map(cat => (
          <div className="dashboard-stat-card" tabIndex={0} key={cat}>
            <span className="dashboard-stat-title">
              <span className="dashboard-stat-chip">{cat}</span> Articles
            </span>
            <span className="dashboard-stat-value">{stats.byCategory[cat]}</span>
          </div>
        ))}
      </section>

      {/* FILTERS */}
      <section className="filters-row" aria-label="Filter articles">
        {/* Category chips */}
        <div>
          <button
            className={`category-chip${activeCategory === "All" ? " selected" : ""}`}
            aria-pressed={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
            tabIndex={0}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip${activeCategory === cat ? " selected" : ""}`}
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              tabIndex={0}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Search bar */}
        <div className="searchbar-wrap">
          <svg width="22" height="22" fill="none" stroke={COLORS.subtext} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="searchbar-input"
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search articles"
          />
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="featured-wrap" aria-label="Featured article">
          <span className="featured-header">Featured Article</span>
          <div className="featured-title">{featured.title}</div>
          <div className="featured-body">
            <div className="featured-content">
              <span className="featured-category">{featured.category}</span>
              <div
                className="featured-preview"
                dangerouslySetInnerHTML={{
                  __html: featured.content.replace(/(<([^>]+)>)/gi, "")
                }}
              />
              <div className="featured-footer">
                Posted on:{" "}
                <time dateTime={featured.created_at}>
                  {new Date(featured.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit"
                  })}
                </time>
              </div>
            </div>
            <img
              src={
                featured.image
                  ? `http://localhost:5000/uploads/${featured.image}`
                  : `https://picsum.photos/seed/${encodeURIComponent(
                      featured.title
                    )}/500/200`
              }
              className="featured-img"
              alt={featured.title}
            />
          </div>
        </section>
      )}

      {/* ARTICLES GRID */}
      <main>
        <div className="articles-grid" aria-live="polite">
          {/* Add new article CTA card */}
          <div
            className="add-article-card"
            tabIndex={0}
            role="button"
            aria-label="Add new article"
            onClick={handleAddNew}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleAddNew();
            }}
          >
            <span className="add-article-icon" aria-hidden="true">
              +
            </span>
            <span>Add New Article</span>
          </div>
          {/* Render filtered articles */}
          {filteredArticles.length === 0 && (
            <div
              className="article-glass-card in-view"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 220,
                fontWeight: 700,
                color: COLORS.subtext,
                fontSize: "1.25rem"
              }}
            >
              No articles found!
            </div>
          )}
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="article-glass-card"
              tabIndex={0}
              aria-labelledby={`article-title-${article.id}`}
              role="region"
            >
              <div className="article-image-wrap">
                {article.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${article.image}`}
                    className="article-image"
                    alt={article.title}
                  />
                ) : (
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(
                      article.title
                    )}/500/200`}
                    className="article-image"
                    alt="Article placeholder"
                  />
                )}
              </div>
              <div className="article-content-wrap">
                <h3
                  id={`article-title-${article.id}`}
                  className="article-title"
                >
                  {article.title}
                </h3>
                <span className="article-category">{article.category}</span>
                <div
                  className="article-preview"
                  dangerouslySetInnerHTML={{
                    __html: article.content.replace(/(<([^>]+)>)/gi, "")
                  }}
                />
              </div>
              <footer className="article-footer">
                Posted on:{" "}
                <time dateTime={article.created_at}>
                  {new Date(article.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit"
                  })}
                </time>
              </footer>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyArticles;