import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-400">
          🐋 Whale Detector
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-emerald-400">داشبورد</Link>
          <Link to="/whales" className="hover:text-emerald-400">نهنگ‌ها</Link>
          <Link to="/alerts" className="hover:text-emerald-400">هشدارها</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
