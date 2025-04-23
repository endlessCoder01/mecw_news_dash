// App.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostNews from './components/PostNews';
import MyArticles from './components/MyArticles';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, artRes] = await Promise.all([
          axios.get('http://localhost:5000/mecw/api/categories'),
          axios.get('http://localhost:5000/mecw/api/articles')
        ]);
        setCategories(catRes.data);
        setArticles(artRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Journalist Dashboard</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/post">Post News</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/articles">My Articles</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/post" element={<PostNews categories={categories} />} />
          <Route path="/articles" element={<MyArticles articles={articles} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Welcome to Journalist Dashboard</h2>;
}

export default App;