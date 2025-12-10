
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { AuthModal } from './components/AuthModal';
import { Role, Service, OrderStatus, User } from './types';
import { createOrder, getCurrentUser, logoutUser } from './services/dataService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form state
  const [clientContact, setClientContact] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const navigateTo = (page: string, section?: string) => {
    // Protect Dashboard route
    if (page === 'dashboard' && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCurrentPage(page);
    
    if (page === 'home') {
      if (section) {
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleOrderClick = (service: Service) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role !== Role.CLIENT) {
        alert('Только клиенты могут создавать заказы. Пожалуйста, зайдите как Клиент.');
        return;
    }
    setSelectedService(service);
    // Pre-fill email if available
    setClientContact(currentUser.email);
    setShowOrderModal(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Logic for redirection upon login
    if (user.role === Role.MANAGER || user.role === Role.OPERATOR) {
      setCurrentPage('dashboard');
    } else {
      // Client goes to Services page to encourage ordering
      setCurrentPage('services');
    }
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !currentUser) return;

    createOrder({
      id: Date.now().toString(),
      clientId: currentUser.id,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      clientName: currentUser.name,
      clientContact: clientContact,
      date: new Date().toISOString(),
      status: OrderStatus.PENDING,
      amount: selectedService.price,
      createdAt: Date.now()
    });

    setShowOrderModal(false);
    setClientContact('');
    alert('Ваш заказ принят! Менеджер свяжется с вами.');
    
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar 
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
      />
      
      <div className="flex-grow">
        {currentPage === 'home' && <Home navigateToServices={() => navigateTo('services')} />}
        {currentPage === 'services' && (
            <Services 
                onOrder={handleOrderClick} 
                currentUser={currentUser} 
                onOpenAuth={() => setShowAuthModal(true)}
                navigateToDashboard={() => navigateTo('dashboard')}
            />
        )}
        {currentPage === 'dashboard' && currentUser && <Dashboard user={currentUser} />}
      </div>

      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Order Modal (Standard Services) */}
      {showOrderModal && selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowOrderModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Оформление заказа: {selectedService.title}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={submitOrder} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Имя (из профиля)</label>
                          <input 
                            type="text" 
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md bg-white shadow-sm py-2 px-3 sm:text-sm text-gray-500 cursor-not-allowed"
                            value={currentUser?.name || ''}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Контактный телефон / Email</label>
                          <input 
                            type="text" 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md bg-white shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            value={clientContact}
                            onChange={(e) => setClientContact(e.target.value)}
                          />
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:col-start-2 sm:text-sm">
                            Подтвердить
                          </button>
                          <button type="button" onClick={() => setShowOrderModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
                            Отмена
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
