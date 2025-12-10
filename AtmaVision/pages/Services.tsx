
import React, { useState } from 'react';
import { Service, Role, User, OrderStatus } from '../types';
import { getServices, getServiceCategories, createOrder } from '../services/dataService';
import { Image, Gift, Clapperboard, Edit3, Send } from 'lucide-react';

interface ServicesProps {
  onOrder: (service: Service) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  navigateToDashboard: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOrder, currentUser, onOpenAuth, navigateToDashboard }) => {
  const services = getServices();
  const categories = getServiceCategories();
  
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Custom Order State
  const [customCategory, setCustomCategory] = useState(categories[0] || 'Общее');
  const [customDescription, setCustomDescription] = useState('');
  const [customContact, setCustomContact] = useState(currentUser?.email || '');

  // Determine if user can order (Guest or Client only)
  const canOrder = !currentUser || currentUser.role === Role.CLIENT;

  const getIcon = (id: string) => {
    if (id === '1') return <Image className="h-12 w-12 text-gray-400" />;
    if (id === '2') return <Gift className="h-12 w-12 text-gray-400" />;
    if (id === '3') return <Clapperboard className="h-12 w-12 text-gray-400" />;
    return <Image className="h-12 w-12 text-gray-400" />;
  };

  const getTitleIcon = (id: string) => {
    if (id === '1') return "📸 ";
    if (id === '2') return "🎁 ";
    if (id === '3') return "🎬 ";
    return "";
  };

  const handleCustomOrderClick = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (currentUser.role !== Role.CLIENT) {
      alert('Только клиенты могут создавать заказы.');
      return;
    }
    setShowCustomForm(true);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !customDescription || !customContact) return;

    createOrder({
      id: Date.now().toString(),
      clientId: currentUser.id,
      serviceId: 'custom-' + Date.now(),
      serviceTitle: `Индивидуальный заказ: ${customCategory}`,
      clientName: currentUser.name,
      clientContact: customContact,
      date: new Date().toISOString(),
      status: OrderStatus.PENDING,
      amount: 0, // 0 indicates individual calculation
      createdAt: Date.now()
    });

    alert('Ваша индивидуальная заявка отправлена! Менеджер свяжется с вами для расчета стоимости.');
    setShowCustomForm(false);
    setCustomDescription('');
    navigateToDashboard();
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide">КАТАЛОГ УСЛУГ</h2>
          <p className="mt-4 text-lg text-gray-500">Выберите готовое решение или закажите индивидуальный проект</p>
          {!canOrder && (
             <p className="mt-2 text-sm text-orange-600 font-medium bg-orange-50 inline-block px-3 py-1 rounded">
               Режим просмотра (Вход: {currentUser?.role === Role.OPERATOR ? 'Оператор' : 'Менеджер'})
             </p>
          )}
        </div>

        {/* Custom Order Call to Action (Top) */}
        {canOrder && (
          <div className="mb-12 bg-orange-600 rounded-lg shadow-xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold flex items-center"><Edit3 className="mr-3"/> Не нашли то, что искали?</h3>
                  <p className="mt-2 text-orange-100">Опишите вашу задачу, и мы предложим индивидуальное решение под ваш бюджет.</p>
              </div>
              <button 
                  onClick={handleCustomOrderClick}
                  className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md whitespace-nowrap"
              >
                  Заказать свою услугу
              </button>
          </div>
        )}
        
        {/* Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center mb-6 rounded-md">
                  {getIcon(service.id)}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3">
                  {getTitleIcon(service.id)} {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                     <span className="text-lg font-bold text-gray-900">{service.price.toLocaleString()} ₽</span>
                     {canOrder && (
                       <span 
                        onClick={() => onOrder(service)}
                        className="text-orange-500 text-xs font-bold uppercase cursor-pointer flex items-center hover:text-orange-600 transition-colors bg-orange-50 px-3 py-1 rounded-full"
                      >
                        ЗАКАЗАТЬ
                      </span>
                     )}
                </div>

                {service.details && service.details.length > 0 && (
                  <div className="text-xs text-gray-600 space-y-2 mt-4 border-t border-gray-100 pt-4">
                    {service.details.map((detail, idx) => (
                      <p key={idx}>• {detail}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Order Modal */}
        {showCustomForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCustomForm(false)}></div>
                    
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">Заказать индивидуальную услугу</h3>
                            <form onSubmit={handleCustomSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория услуги</label>
                                    <select 
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 bg-white sm:text-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="Другое">Другое</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание задачи</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        value={customDescription}
                                        onChange={(e) => setCustomDescription(e.target.value)}
                                        placeholder="Опишите, что вам нужно, какие сроки, референсы..."
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 bg-white sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Данные для обратной связи</label>
                                    <input 
                                        type="text"
                                        required
                                        value={customContact}
                                        onChange={(e) => setCustomContact(e.target.value)}
                                        placeholder="Телефон или Email"
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 bg-white sm:text-sm"
                                    />
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:col-start-2 sm:text-sm">
                                        <Send className="w-4 h-4 mr-2" /> Отправить заявку
                                    </button>
                                    <button type="button" onClick={() => setShowCustomForm(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
