import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PenSquare, Menu, X, Shield } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const [clickCount, setClickCount] = useState(0);
  const [showAdminLink, setShowAdminLink] = useState(false);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/about', label: '关于' },
    ...(showAdminLink ? [{ path: '/admin/review', label: '审核中心', icon: Shield }] : []),
  ];

  const handleLogoClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setShowAdminLink(true);
      setClickCount(0);
      if (newCount === 5) {
        setTimeout(() => {
          navigate('/admin/review');
        }, 300);
      }
    }
    
    setTimeout(() => setClickCount(0), 2000);
  }, [clickCount, navigate]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={handleLogoClick}
            title={showAdminLink ? '管理员模式已激活' : '连续点击5次进入管理员模式'}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 font-serif">
                选课经验墙
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                学长学姐帮你避坑
                {showAdminLink && <span className="ml-2 text-primary-500">· 管理员</span>}
              </p>
            </div>
            {clickCount > 0 && (
              <span className="text-xs text-gray-400 ml-2">
                {clickCount}/5
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            
            <Link to="/review/new" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
              <PenSquare className="w-4 h-4" />
              写评价
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-up">
          <div className="container px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            <Link
              to="/review/new"
              onClick={closeMobileMenu}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              写评价
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
