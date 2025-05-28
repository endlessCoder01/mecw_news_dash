// AppRoutes.js
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostNews from './components/PostNews';
import MyArticles from './components/MyArticles';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DashboardHome from './components/DashboardHome';
import Adder from './components/Adder';
import Login from './components/login';

function AppRoutes () {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const location = useLocation();

  const hideNavbarRoutes = ['/'];

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

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
          <div className='container'>
            <Link className='navbar-brand' to='/'>
              Journalist Dashboard
            </Link>
            <div className='collapse navbar-collapse'>
              <ul className='navbar-nav me-auto'>
                <li className='nav-item'>
                  <Link className='nav-link' to='/post'>
                    Post News
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/articles'>
                    My Articles
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <div className='container mt-4'>
        <Routes>
          <Route path='/post' element={<PostNews categories={categories} />} />
          <Route path='/' element={<Login />} />
          <Route path='/add' element={<Adder />} />
          <Route path='/articles' element={<MyArticles articles={articles} />} />
          <Route path='/dash' element={<DashboardHome articles={articles} categories={categories} />} />
        </Routes>
      </div>
    </>
  );
}

export default AppRoutes;
