import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './PostNews.module.css';
import Swal from 'sweetalert2';

const MAX_TITLE = 120;

const initialForm = {
  title: '',
  content: '',
  category_id: '',
  author_id: '',
  image: null,
  tags: [],
  seoDesc: ''
};


const PostNews = ({ categories }) => {
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const quillRef = useRef();



  // --- LIVE WORD/CHAR COUNTS
  useEffect(() => {
    const text = quillRef.current ? quillRef.current.getEditor().getText() : '';
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  }, [formData.content]);


 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // --- DRAG N DROP IMAGE
  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(f => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- FORM SUBMIT
  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category_id', formData.category_id);
    data.append('author_id', formData.author_id);
    data.append('image', formData.image);
    try {
      await axios.post('http://localhost:5000/mecw/api/articles', data);
      Swal.fire({
        title: 'Success!',
        text: 'Article posted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setFormData(initialForm);
      setPreview('');
      setDraftStatus('');
      setShowReset(false);
    } catch (error) {
        Swal.fire({
        title: 'Error!',
        text: 'Failed to publish article. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setSaving(false);
    }
  };

  // --- RESET FORM
  const handleReset = () => {
    setFormData(initialForm);
    setPreview('');
    setDraftStatus('');
    setShowReset(false);
  };


  return (
    <div className={styles.page}>
      <div className={styles.bgAnim} aria-hidden="true"></div>
      
      {/* <button
        aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={styles.themeToggle}
        onClick={toggleTheme}
        tabIndex={0}
        type="button"
      >
        {theme === 'dark' ? (
          <span title="Light mode" role="img">🌞</span>
        ) : (
          <span title="Dark mode" role="img">🌙</span>
        )}
      </button> */}

      {/* CARD */}
      <section className={styles.card} aria-label="Create New Article" role="main">
        <header className={styles.cardHeader}>
          <h2 tabIndex={0}>Create New Article</h2>
          <span className={styles.draftStatus}>{draftStatus}</span>
        </header>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label="Post News Form"
        >
          {/* TITLE */}
          <div className={styles.formGroup}>
            <label htmlFor="news-title" className={styles.label}>
              Title
              <span className={styles.charCounter}>
                {formData.title.length}/{MAX_TITLE}
              </span>
            </label>
            <input
              id="news-title"
              type="text"
              className={styles.input}
              maxLength={MAX_TITLE}
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              required
              aria-required="true"
              autoFocus
            />
          </div>
     
          {/* CATEGORY & AUTHOR */}
          <div className={styles.flexRow}>
            <div className={styles.flexCol}>
              <label htmlFor="category" className={styles.label}>Category</label>
              <select
                id="category"
                className={styles.input}
                value={formData.category_id}
                onChange={e => setFormData(f => ({ ...f, category_id: e.target.value }))}
                required
                aria-required="true"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.flexCol}>
              <label htmlFor="author" className={styles.label}>Author ID</label>
              <input
                id="author"
                type="number"
                className={styles.input}
                value={formData.author_id}
                onChange={e => setFormData(f => ({ ...f, author_id: e.target.value }))}
                required
                aria-required="true"
              />
            </div>
          </div>
          {/* CONTENT */}
          <div className={styles.formGroup}>
            <label htmlFor="news-content" className={styles.label}>
              Content
              <span className={styles.charCounter}>
                {wordCount} words | {charCount} chars
              </span>
            </label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={content => setFormData(f => ({ ...f, content }))}
              className={styles.richText}
              style={{ minHeight: '240px', borderRadius: '1.1em' }}
              aria-required="true"
            />
          </div>
          {/* IMAGE UPLOAD */}
          <div
            className={styles.formGroup}
            onDragOver={e => e.preventDefault()}
            onDrop={handleImageDrop}
            tabIndex={0}
            aria-label="Featured Image (drag and drop supported)"
          >
            <label htmlFor="image-upload" className={styles.label}>
              Featured Image
              <span className={styles.helpText}>(drag &amp; drop or click)</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={handleImageChange}
              aria-required="true"
              required
            />
            {preview && (
              <div className={styles.previewImgWrap}>
                <img src={preview} alt="Preview" className={styles.previewImg} />
              </div>
            )}
          </div>
          {/* BUTTONS */}
          <div className={styles.buttonRow}>
            <button
              type="submit"
              disabled={saving}
              className={styles.btn + ' ' + styles.btnPrimary}
              aria-busy={saving}
            >
              {saving ? 'Publishing...' : 'Publish Article'}
            </button>
            {/* <button
              type="button"
              className={styles.btn + ' ' + styles.btnGlass}
              onClick={e => handleSubmit(e, true)}
              disabled={saving}
            >
              Save as Draft
            </button> */}
            {showReset && (
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnReset}
                onClick={handleReset}
                aria-label="Reset form"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </section>
      {/* Floating action - Scroll to Top */}
      <button
        className={styles.fab}
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        aria-label="Back to Top"
        type="button"
      >
        ⬆
      </button>
    </div>
  );
};

export default PostNews;