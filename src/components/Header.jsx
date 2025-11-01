import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // No header for landing page
  if (isHomePage) {
    return null;
  }

  // Full header for other pages (like booking form)
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;


