import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-4">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#a00000] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;


