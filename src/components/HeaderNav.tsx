import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeaderNav = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userAuth');

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    navigate('/');
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="text-xl font-bold">
          MyApp
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Entrar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;