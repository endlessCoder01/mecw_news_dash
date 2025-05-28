import React, { useState, useRef, useEffect } from 'react';
import api from './api';
import Swal from 'sweetalert2';
import NET from 'vanta/dist/vanta.net.min';

const COLOR_PALETTES = {
  light: {
    background: "#f4f6fb",
    card: "rgba(255,255,255,0.75)",
    border: "#e3e7ee",
    accent: "#6C63FF",
    accent2: "#00C9A7",
    text: "#232946",
    placeholder: "#b0b4c1"
  },
  dark: {
    background: "#191923",
    card: "rgba(33,34,53,0.85)",
    border: "#27283c",
    accent: "#6C63FF",
    accent2: "#00C9A7",
    text: "#f5f6fa",
    placeholder: "#6a6d8e"
  }
};

const Adder = () => {
  const [formData, setFormData] = useState({ type: 'author', username: '', email: '', password: '', name: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // For Vanta background limited to Adder only
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (vantaEffect.current) vantaEffect.current.destroy();
    vantaEffect.current = NET({
      el: vantaRef.current,
      color: darkMode ? 0x6C63FF : 0x00C9A7,
      backgroundColor: darkMode ? 0x191923 : 0xf4f6fb,
      maxDistance: 20,
      points: 8.0,
      spacing: 18.0,
      mouseControls: true,
      touchControls: true,
      minHeight: 400,
      minWidth: 200
    });
    return () => { if (vantaEffect.current) vantaEffect.current.destroy(); };
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = formData.type === 'author' ? '/api/register' : '/api/categories';
      const data = formData.type === 'author'
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { name: formData.name };
      await api.post(endpoint, data);
      await Swal.fire({
        title: 'Success!',
        text: `${formData.type === 'author' ? 'Author' : 'Category'} added successfully.`,
        icon: 'success',
        showConfirmButton: false,
        timer: 1400
      });
      setFormData({ type: formData.type, username: '', email: '', password: '', name: '' });
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'There was an error adding the data.',
        icon: 'error',
        showConfirmButton: true
      });
    }
    setLoading(false);
  };

  const palette = darkMode ? COLOR_PALETTES.dark : COLOR_PALETTES.light;

  const AnimatedLabel = ({ htmlFor, children }) => (
    <label
      htmlFor={htmlFor}
      style={{
        color: palette.text,
        fontWeight: 500,
        letterSpacing: "0.01em",
        fontSize: "1.06rem",
        display: "block",
        marginBottom: "0.3em",
        transition: "color 0.4s"
      }}>{children}</label>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: palette.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 0
    }}>
      {/* Background strictly inside adder, under card */}
      <div
        ref={vantaRef}
        className="adder-bg"
        style={{
          position: "absolute",
          top: 0, left: 0, width: "100%",
          height: "100%",
          zIndex: 0,
          borderRadius: "32px",
          overflow: 'hidden'
        }}
        aria-hidden="true"
      />
      {/* Theme toggle floating above everything */}
      <button
        aria-label="Toggle dark mode"
        className="theme-toggle"
        style={{
          position: "fixed",
          top: 22,
          right: 28,
          zIndex: 20,
          background: "none",
          border: "none",
          outline: "none",
          cursor: "pointer",
          fontSize: "2rem",
          transition: "color 0.5s",
          color: palette.accent
        }}
        onClick={() => setDarkMode(d => !d)}
      >
        {darkMode ?
          <span role="img" aria-label="Light mode">🌞</span> :
          <span role="img" aria-label="Dark mode">🌙</span>
        }
      </button>
      {/* MAIN CARD */}
      <div
        className="adder-container glass"
        tabIndex="0"
        aria-label="Adder form"
        style={{
          minHeight: "520px",
          width: "98vw",
          maxWidth: 420,
          margin: "80px auto",
          borderRadius: "32px",
          boxShadow: darkMode
            ? "0 8px 40px 0 rgba(25,25,35,0.44), 0 1.5px 8px 0 #00C9A71c"
            : "0 8px 48px 0 rgba(108,99,255,0.10), 0 1.5px 8px 0 #00C9A71c",
          background: palette.card,
          border: `1.8px solid ${palette.border}`,
          backdropFilter: "blur(14.5px)",
          WebkitBackdropFilter: "blur(14.5px)",
          padding: "40px 32px 36px 32px",
          position: "relative",
          zIndex: 1,
          transition: "background 0.7s, box-shadow 0.6s"
        }}
      >
        <h2
          className="title"
          style={{
            color: palette.text,
            fontWeight: 700,
            fontSize: "2.1rem",
            textAlign: "center",
            margin: "0 0 18px 0",
            letterSpacing: "0.02em",
            textShadow: darkMode
              ? "0 2px 14px #23294655"
              : "0 2px 12px #6C63FF15"
          }}
        >
          Add {formData.type === 'author' ? 'Author' : 'Category'}
        </h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
          <select
            className="select"
            name="type"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            style={{
              padding: "0.55em 1.5em 0.55em 1em",
              borderRadius: "16px",
              border: `1.5px solid ${palette.border}`,
              outline: "none",
              background: darkMode ? "#24243b" : "#f6f6fb",
              color: palette.text,
              fontWeight: 500,
              fontSize: "1.08rem",
              boxShadow: darkMode
                ? "0 1.5px 5px 0 #00C9A715"
                : "0 1.5px 5px 0 #6C63FF12",
              cursor: "pointer",
              margin: 0,
              transition: "background 0.5s, color 0.5s, border 0.5s"
            }}
            aria-label="Choose to add author or category"
          >
            <option value="author">Author</option>
            <option value="category">Category</option>
          </select>
        </div>
        <form onSubmit={handleSubmit} className="form" autoComplete="off" style={{ marginTop: 8 }}>
          <div
            className="slide-in"
            style={{
              animation: "fadeUp 0.7s cubic-bezier(.48,1.32,.56,1) both"
            }}
          >
            {formData.type === 'author' && (
              <>
                <div className="form-group" style={{ marginBottom: "1.1em" }}>
                  <AnimatedLabel htmlFor="username">Username</AnimatedLabel>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                    autoComplete="username"
                    style={{
                      width: "100%",
                      padding: "0.85em 1.4em",
                      borderRadius: "14px",
                      border: `1.5px solid ${palette.border}`,
                      background: darkMode ? "#232946" : "#f9fafd",
                      color: palette.text,
                      fontSize: "1.07rem",
                      fontWeight: 500,
                      outline: "none",
                      boxShadow: "0 0 0px 0 #00C9A710",
                      marginTop: "0.15em",
                      marginBottom: "2px",
                      transition: "background 0.45s, color 0.45s, border 0.45s"
                    }}
                    aria-label="Username"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.1em" }}>
                  <AnimatedLabel htmlFor="email">Email</AnimatedLabel>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    autoComplete="email"
                    style={{
                      width: "100%",
                      padding: "0.85em 1.4em",
                      borderRadius: "14px",
                      border: `1.5px solid ${palette.border}`,
                      background: darkMode ? "#232946" : "#f9fafd",
                      color: palette.text,
                      fontSize: "1.07rem",
                      fontWeight: 500,
                      outline: "none",
                      boxShadow: "0 0 0px 0 #00C9A710",
                      marginTop: "0.15em",
                      marginBottom: "2px",
                      transition: "background 0.45s, color 0.45s, border 0.45s"
                    }}
                    aria-label="Email"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "1.45em" }}>
                  <AnimatedLabel htmlFor="password">Password</AnimatedLabel>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    autoComplete="new-password"
                    style={{
                      width: "100%",
                      padding: "0.85em 1.4em",
                      borderRadius: "14px",
                      border: `1.5px solid ${palette.border}`,
                      background: darkMode ? "#232946" : "#f9fafd",
                      color: palette.text,
                      fontSize: "1.07rem",
                      fontWeight: 500,
                      outline: "none",
                      boxShadow: "0 0 0px 0 #00C9A710",
                      marginTop: "0.15em",
                      marginBottom: "2px",
                      transition: "background 0.45s, color 0.45s, border 0.45s"
                    }}
                    aria-label="Password"
                  />
                </div>
              </>
            )}
            {formData.type === 'category' && (
              <div className="form-group" style={{ marginBottom: "2.7em" }}>
                <AnimatedLabel htmlFor="category-name">Name</AnimatedLabel>
                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Category name"
                  autoComplete="off"
                  style={{
                    width: "100%",
                    padding: "0.85em 1.4em",
                    borderRadius: "14px",
                    border: `1.5px solid ${palette.border}`,
                    background: darkMode ? "#232946" : "#f9fafd",
                    color: palette.text,
                    fontSize: "1.07rem",
                    fontWeight: 500,
                    outline: "none",
                    boxShadow: "0 0 0px 0 #00C9A710",
                    marginTop: "0.15em",
                    marginBottom: "2px",
                    transition: "background 0.45s, color 0.45s, border 0.45s"
                  }}
                  aria-label="Category name"
                />
              </div>
            )}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
              style={{
                padding: "0.9em 0",
                width: "100%",
                borderRadius: "18px",
                border: "none",
                outline: "none",
                background: loading
                  ? palette.accent2
                  : `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.14rem",
                letterSpacing: ".01em",
                boxShadow: darkMode
                  ? "0 2px 18px 0 #00C9A735, 0 1.5px 8px 0 #6C63FF13"
                  : "0 2px 18px 0 #6C63FF25, 0 1.5px 8px 0 #00C9A713",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.72 : 1,
                marginTop: "10px",
                transition: "background 0.4s, box-shadow 0.4s, opacity 0.3s"
              }}
              aria-busy={loading}
              aria-disabled={loading}
            >
              {loading
                ? <span style={{ fontWeight: 400, fontSize: '1.05em', letterSpacing: 0.5 }}>Processing…</span>
                : <>Add {formData.type === 'author' ? 'Author' : 'Category'}</>
              }
            </button>
          </div>
        </form>
      </div>

      <style>{`
        html, body { min-height: 100vh; margin:0; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: ${palette.background}; }
        .glass::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 32px;
          pointer-events: none;
          z-index: 1;
          background: ${darkMode
            ? 'linear-gradient(125deg, rgba(33,34,53,0.21), rgba(33,34,53,0.06))'
            : 'linear-gradient(125deg, rgba(255,255,255,0.12), rgba(240,250,255,0.06))'};
          opacity: 0.93;
          filter: blur(1.8px);
        }
        .slide-in { animation: fadeUp 0.7s cubic-bezier(.48,1.32,.56,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98);}
          to { opacity: 1; transform: none;}
        }
        input, select {
          outline: none;
          -webkit-appearance: none;
        }
        input::placeholder {
          color: ${palette.placeholder};
          opacity: 1;
          font-weight: 400;
          letter-spacing: .01em;
          transition: color 0.45s;
        }
        @media (max-width: 600px) {
          .adder-container {
            padding: 18vw 5vw 8vw 5vw !important;
            min-height: 380px !important;
            max-width: 97vw !important;
            margin: 8vw 0 !important;
          }
          h2.title {
            font-size: 1.45rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Adder;