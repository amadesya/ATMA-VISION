import React, { useState } from 'react';
import { Role, User } from '../types';
import { Video, LogOut, LogIn, Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (page: string, section?: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onNavigate, onLogout, onOpenAuth }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <Video className="h-8 w-8 text-orange-600 mr-2 flex-shrink-0" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-gray-900 truncate">ATMA VISION</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-orange-600 font-medium transition">ГЛАВНАЯ</button>
            <button onClick={() => onNavigate('services')} className="text-gray-600 hover:text-orange-600 font-medium transition">УСЛУГИ</button>
            {currentUser && (
               <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-orange-600 font-medium transition">
                 {currentUser.role === Role.CLIENT ? 'МОИ ЗАКАЗЫ' : 'КАБИНЕТ'}
               </button>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role === Role.CLIENT && 'Клиент'}
                    {currentUser.role === Role.OPERATOR && 'Оператор'}
                    {currentUser.role === Role.MANAGER && 'Менеджер'}
                  </p>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center text-gray-500 hover:text-red-600 transition"
                  title="Выйти"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center text-gray-600 hover:text-orange-600 font-medium transition"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Войти
              </button>
            )}
            
            <button className="hidden lg:block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition text-sm whitespace-nowrap">
              +7 (915) 047-84-13
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNavClick('home')} 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
            >
              ГЛАВНАЯ
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
            >
              УСЛУГИ
            </button>
            {currentUser && (
              <button 
                onClick={() => handleNavClick('dashboard')} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              >
                {currentUser.role === Role.CLIENT ? 'МОИ ЗАКАЗЫ' : 'КАБИНЕТ'}
              </button>
            )}
          </div>
          
          <div className="pt-4 pb-4 border-t border-gray-200">
            {currentUser ? (
              <div className="px-5">
                <div className="flex items-center mb-3">
                  <div className="ml-0">
                    <div className="text-base font-medium leading-none text-gray-800">{currentUser.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-500 mt-1">
                      {currentUser.role === Role.CLIENT && 'Клиент'}
                      {currentUser.role === Role.OPERATOR && 'Оператор'}
                      {currentUser.role === Role.MANAGER && 'Менеджер'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Выйти
                </button>
              </div>
            ) : (
              <div className="px-5">
                <button 
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  <LogIn className="h-4 w-4 mr-2" /> Войти
                </button>
              </div>
            )}
            
            <div className="mt-4 px-5">
               <a href="tel:+79150478413" className="w-full flex items-center justify-center px-4 py-2 border border-orange-200 text-orange-700 bg-orange-50 rounded-md text-sm font-medium">
                 <Phone className="h-4 w-4 mr-2" /> +7 (915) 047-84-13
               </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};