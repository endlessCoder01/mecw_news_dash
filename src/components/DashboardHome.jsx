import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styles from './DashboardHome.module.css'

function cleanCat (name) {
  return (name || '').replace(/[\r\n]+/g, '').trim()
}

function timeAgo (dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function DashboardHome ({ articles = [], categories = [] }) {
  // Precompute dashboard stats
  const stats = useMemo(() => {
    const uniqueAuthors = new Set(articles.map(a => a.author_id))
    const latest = articles.reduce(
      (acc, a) =>
        !acc || new Date(a.created_at) > new Date(acc.created_at) ? a : acc,
      null
    )
    return {
      articles: articles.length,
      categories: categories.length,
      authors: uniqueAuthors.size,
      lastDate: latest ? latest.created_at : null
    }
  }, [articles, categories])

  // Latest three articles
  const latestArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
  }, [articles])

  return (
    <div className={styles.homePage}>
      <div className={styles.bgAnim} aria-hidden='true'></div>
      <div className={styles.heroWrap}>
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>📰 Journalist Dashboard</h1>
          <p className={styles.heroSub}>
            Manage your news, publish instantly, and track your impact.
            <br />
            <span className={styles.heroStat}>
              <span>{stats.articles}</span> Articles
            </span>
            <span className={styles.heroStat}>
              <span>{stats.categories}</span> Categories
            </span>
            <span className={styles.heroStat}>
              <span>{stats.authors}</span> Authors
            </span>
            <span className={styles.heroStat}>
              <span>{stats.lastDate ? timeAgo(stats.lastDate) : '--'}</span>{' '}
              Last Post
            </span>
          </p>
          <div className={styles.heroActions}>
            <Link to='/post' className={styles.btn + ' ' + styles.btnPrimary}>
              + Post News
            </Link>
            <Link to='/articles' className={styles.btn + ' ' + styles.btnGlass}>
              My Articles
            </Link>
            <Link to='/add' className={styles.btn + ' ' + styles.btnPrimary}>
              + Add Author/Category
            </Link>
          </div>
        </div>
      </div>
      <section className={styles.latestSection} aria-labelledby='latest-news'>
        <h2 id='latest-news' className={styles.sectionTitle}>
          Latest Articles
        </h2>
        <div className={styles.articleGrid}>
          {latestArticles.length === 0 && (
            <div className={styles.emptyBox}>
              <span role='img' aria-label='empty'>
                🦗
              </span>{' '}
              No articles yet. Go ahead and <Link to='/post'>publish!</Link>
            </div>
          )}
          {latestArticles.map(article => (
            <Link
              to='/articles'
              className={styles.articleCard}
              key={article.id}
              tabIndex={0}
            >
              <div className={styles.articleImgWrap}>
                <img
                  src={`http://localhost:5000/uploads/${article.image}`}
                  alt={article.title}
                  className={styles.articleImg}
                  loading='lazy'
                />
                <span className={styles.catBadge}>
                  {cleanCat(article.category)}
                </span>
              </div>
              <div className={styles.articleBody}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <div className={styles.articleMeta}>
                  <span className={styles.metaAuthor}>
                    By {article.author || 'Unknown'}
                  </span>
                  <span className={styles.metaDate}>
                    {timeAgo(article.created_at)}
                  </span>
                </div>
                <div
                  className={styles.articleExcerpt}
                  dangerouslySetInnerHTML={{
                    __html:
                      (article.content || '')
                        .replace(/<[^>]+>/g, '')
                        .slice(0, 110) + '...'
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Journalist Dashboard
      </footer>
    </div>
  )
}
