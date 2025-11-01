import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'bg-transparent' : 'bg-gray-50'}`}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;














