
import React, { useState, useEffect } from 'react';
import { Role, Order, Service, OrderStatus, User, Message } from '../types';
import { getOrders, getServices, updateOrderStatus, addService, getAllUsers, updateUserRole, getOperators, assignOperator, getMessagesForOrder, sendMessage } from '../services/dataService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { FileText, Plus, RefreshCw, Printer, Users as UsersIcon, MessageSquare, Send } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [operators, setOperators] = useState<User[]>([]);
  
  // Set default tab based on role
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'reports' | 'users' | 'messages'>(
    user.role === Role.MANAGER ? 'services' : 'orders'
  );

  // Chat State
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  
  // New Service Form State
  const [newService, setNewService] = useState({ title: '', price: '', category: '' });

  useEffect(() => {
    refreshData();
  }, [user, activeTab]);

  useEffect(() => {
      if (selectedOrderForChat) {
          setChatMessages(getMessagesForOrder(selectedOrderForChat.id));
          // Poll for new messages every 3 seconds while chat is open (simulating realtime)
          const interval = setInterval(() => {
             setChatMessages(getMessagesForOrder(selectedOrderForChat.id));
          }, 3000);
          return () => clearInterval(interval);
      }
  }, [selectedOrderForChat]);

  const refreshData = () => {
    setOrders(getOrders(user));
    setServices(getServices());
    if (user.role === Role.MANAGER) {
      setUsers(getAllUsers());
      setOperators(getOperators());
    }
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    updateOrderStatus(id, newStatus);
    refreshData();
  };
  
  const handleOperatorAssignment = (orderId: string, operatorId: string) => {
      assignOperator(orderId, operatorId);
      refreshData();
  };
  
  const handleRoleChange = (userId: string, newRole: Role) => {
      updateUserRole(userId, newRole);
      refreshData();
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessageText.trim() || !selectedOrderForChat) return;

      sendMessage({
          orderId: selectedOrderForChat.id,
          senderId: user.id,
          senderName: user.name,
          text: newMessageText
      });

      setNewMessageText('');
      setChatMessages(getMessagesForOrder(selectedOrderForChat.id));
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.price) return;
    addService({
      id: Date.now().toString(),
      title: newService.title,
      description: 'Новая услуга от менеджера',
      price: Number(newService.price),
      category: newService.category || 'Общее',
      image: '',
      details: ['Описание добавлено менеджером']
    });
    setNewService({ title: '', price: '', category: '' });
    refreshData();
    alert('Услуга добавлена!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenChat = (order: Order) => {
      setSelectedOrderForChat(order);
      if (activeTab !== 'messages') {
          setActiveTab('messages');
      }
  };

  // --- RENDER HELPERS ---

  const renderChatView = () => {
      // Filter orders relevant for chat
      // For Client: their orders
      // For Operator: orders assigned to them
      // For Manager: all orders
      const chatOrders = user.role === Role.CLIENT 
        ? orders 
        : user.role === Role.OPERATOR 
            ? orders.filter(o => o.operatorId === user.id)
            : orders;

      return (
          <div className="flex h-[600px] bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              {/* Sidebar List */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-bold text-gray-700">Ваши чаты</h3>
                  </div>
                  <div className="overflow-y-auto flex-1">
                      {chatOrders.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500">Нет активных заказов для чата.</p>
                      ) : (
                          chatOrders.map(order => (
                              <div 
                                  key={order.id} 
                                  onClick={() => setSelectedOrderForChat(order)}
                                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors ${selectedOrderForChat?.id === order.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}`}
                              >
                                  <p className="font-medium text-gray-900 truncate">{order.serviceTitle}</p>
                                  <div className="flex justify-between mt-1">
                                      <span className="text-xs text-gray-500">{order.clientName}</span>
                                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">Статус: {order.status}</p>
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Chat Window */}
              <div className="w-2/3 flex flex-col">
                  {selectedOrderForChat ? (
                      <>
                          {/* Chat Header */}
                          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                              <div>
                                  <h3 className="font-bold text-gray-800">{selectedOrderForChat.serviceTitle}</h3>
                                  <p className="text-xs text-gray-500">Заказ #{selectedOrderForChat.id.slice(-6)} | {selectedOrderForChat.clientName}</p>
                              </div>
                              <div className="text-right">
                                  {user.role === Role.CLIENT && selectedOrderForChat.operatorName ? (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Оператор: {selectedOrderForChat.operatorName}</span>
                                  ) : (
                                    <span className={`text-xs px-2 py-1 rounded ${selectedOrderForChat.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {selectedOrderForChat.status}
                                    </span>
                                  )}
                              </div>
                          </div>

                          {/* Messages Area */}
                          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                              {chatMessages.length === 0 ? (
                                  <div className="text-center text-gray-400 mt-10">
                                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50"/>
                                      <p>Сообщений пока нет. Начните диалог.</p>
                                  </div>
                              ) : (
                                  chatMessages.map(msg => {
                                      const isMe = msg.senderId === user.id;
                                      return (
                                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${isMe ? 'bg-orange-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                                  <div className="flex justify-between items-baseline mb-1 space-x-2">
                                                      <span className={`text-xs font-bold ${isMe ? 'text-orange-200' : 'text-gray-500'}`}>{msg.senderName}</span>
                                                      <span className={`text-[10px] ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                  </div>
                                                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                              </div>
                                          </div>
                                      )
                                  })
                              )}
                          </div>

                          {/* Input Area */}
                          <div className="p-4 bg-white border-t border-gray-200">
                              <form onSubmit={handleSendMessage} className="flex space-x-2">
                                  <input 
                                      type="text" 
                                      value={newMessageText}
                                      onChange={(e) => setNewMessageText(e.target.value)}
                                      placeholder="Введите сообщение..."
                                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                  />
                                  <button type="submit" className="bg-orange-600 text-white rounded-lg p-2 hover:bg-orange-700 transition-colors">
                                      <Send className="h-5 w-5" />
                                  </button>
                              </form>
                          </div>
                      </>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                          <MessageSquare className="h-16 w-16 mb-4 opacity-20"/>
                          <p>Выберите чат слева, чтобы начать общение</p>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const renderClientView = () => (
    <div className="space-y-6">
      <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200 pb-4 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Мои заказы</button>
        <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'messages' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Сообщения</button>
      </div>

      {activeTab === 'messages' && renderChatView()}
      
      {activeTab === 'orders' && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Моя история заказов</h2>
          <div className="bg-white shadow sm:rounded-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <li className="p-10 text-center text-gray-500 flex flex-col items-center">
                  <span className="text-lg font-medium">У вас пока нет заказов.</span>
                  <span className="text-sm mt-2">Выберите услугу на главной странице, чтобы оформить заказ.</span>
                </li>
              ) : (
                orders.map((order) => (
                  <li key={order.id} className="p-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                           <p className="text-sm font-medium text-orange-600 truncate">{order.serviceTitle}</p>
                           <button 
                              onClick={() => handleOpenChat(order)} 
                              className="text-gray-400 hover:text-orange-600 transition-colors"
                              title="Открыть чат"
                           >
                              <MessageSquare className="h-4 w-4" />
                           </button>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                          <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                          <span className="hidden sm:inline mx-2">•</span>
                          <p className="text-xs text-gray-400">ID: {order.id.slice(-6)}</p>
                          {order.operatorName && (
                              <>
                                 <span className="hidden sm:inline mx-2">•</span>
                                 <p className="text-xs text-gray-600">Оператор: {order.operatorName}</p>
                              </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <p className="text-sm font-bold text-gray-900 mb-0 sm:mb-1">{order.amount.toLocaleString()} ₽</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === OrderStatus.ACCEPTED ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-0 sm:ml-3">
                <p className="text-sm text-blue-700">
                  Чтобы сделать новый заказ, перейдите в раздел <a href="#" onClick={(e) => {e.preventDefault(); document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})}} className="font-medium underline">Услуги</a>.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOperatorView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Панель оператора</h2>
        <button onClick={refreshData} className="text-gray-600 hover:text-orange-600 flex items-center" title="Обновить">
          <RefreshCw className="h-5 w-5 mr-1" /> <span className="sm:hidden">Обновить</span>
        </button>
      </div>

      <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200 pb-4 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Текущие задачи</button>
        <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'messages' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Сообщения</button>
      </div>

      {activeTab === 'messages' && renderChatView()}
      
      {activeTab === 'orders' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Услуга</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Чат</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                     <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Нет активных заказов</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className={order.operatorId === user.id ? "bg-orange-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.clientName}</div>
                          <div className="text-sm text-gray-500">{order.clientContact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="max-w-[150px] truncate" title={order.serviceTitle}>{order.serviceTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                                onClick={() => handleOpenChat(order)}
                                className="text-orange-600 hover:text-orange-800 flex items-center"
                            >
                                <MessageSquare className="h-5 w-5 mr-1" /> Сообщения
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <select 
                              value={order.status} 
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className={`block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white sm:text-sm
                                ${order.status === OrderStatus.COMPLETED ? 'text-green-800 bg-green-50' : 
                                  order.status === OrderStatus.PENDING ? 'text-yellow-800 bg-yellow-50' : 
                                  order.status === OrderStatus.ACCEPTED ? 'text-blue-800 bg-blue-50' : 
                                  'text-red-800 bg-red-50'}`}
                           >
                             {Object.values(OrderStatus).map(status => (
                               <option key={status} value={status}>{status}</option>
                             ))}
                           </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
      )}
    </div>
  );

  const renderManagerView = () => {
    // Analytics preparation
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);
    const dataByService = services.map(s => {
      const count = orders.filter(o => o.serviceId === s.id).length;
      return { name: s.title.substring(0, 15) + '...', value: count * s.price, count };
    });
    
    // Filter out zero revenue for better charts
    const chartData = dataByService.filter(d => d.value > 0);
    const COLORS = ['#FB4C03', '#3B82F6', '#10B981', '#F59E0B'];

    return (
      <div className="space-y-6">
        <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200 pb-4 no-print overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'services' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Услуги</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Все заказы</button>
          <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'messages' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Сообщения</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'users' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Пользователи</button>
          <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium ${activeTab === 'reports' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}>Отчеты</button>
        </div>

        {activeTab === 'messages' && renderChatView()}

        {activeTab === 'orders' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Управление заказами</h3>
                <button onClick={refreshData} className="text-gray-500 hover:text-orange-600"><RefreshCw size={20}/></button>
             </div>
             
             <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Услуга</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оператор</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Чат</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.clientName}</div>
                            <div className="text-sm text-gray-500">{order.clientContact}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="max-w-[150px] truncate" title={order.serviceTitle}>{order.serviceTitle}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             <select 
                                value={order.operatorId || ''} 
                                onChange={(e) => handleOperatorAssignment(order.id, e.target.value)}
                                className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                             >
                               <option value="">Не назначен</option>
                               {operators.map(op => (
                                 <option key={op.id} value={op.id}>{op.name}</option>
                               ))}
                             </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button onClick={() => handleOpenChat(order)} className="text-gray-400 hover:text-orange-600">
                                  <MessageSquare className="h-5 w-5" />
                              </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             <select 
                                value={order.status} 
                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className={`block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white sm:text-sm
                                  ${order.status === OrderStatus.COMPLETED ? 'text-green-800 bg-green-50' : 
                                    order.status === OrderStatus.PENDING ? 'text-yellow-800 bg-yellow-50' : 
                                    order.status === OrderStatus.ACCEPTED ? 'text-blue-800 bg-blue-50' : 
                                    'text-red-800 bg-red-50'}`}
                             >
                               {Object.values(OrderStatus).map(status => (
                                 <option key={status} value={status}>{status}</option>
                               ))}
                             </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
           </div>
        )}
        
        {activeTab === 'users' && (
           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
             <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
               <h3 className="text-lg leading-6 font-medium text-gray-900">Управление пользователями</h3>
               <button onClick={refreshData} className="text-gray-500 hover:text-orange-600"><RefreshCw size={20}/></button>
             </div>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            disabled={u.id === user.id} // Cannot change own role
                          >
                            <option value={Role.CLIENT}>Клиент</option>
                            <option value={Role.OPERATOR}>Оператор</option>
                            <option value={Role.MANAGER}>Менеджер</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Добавить новую услугу</h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название</label>
                  <input type="text" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Цена (₽)</label>
                  <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Категория</label>
                  <input type="text" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-5 w-5 mr-2" /> Добавить
                </button>
              </form>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Текущие услуги</h3>
              <ul className="divide-y divide-gray-200 h-64 overflow-y-auto">
                {services.map(s => (
                  <li key={s.id} className="py-3 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">{s.title}</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-2">{s.price} ₽</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8 print-section">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center no-print gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Финансовый отчет</h2>
              <div className="flex space-x-2 w-full sm:w-auto">
                 <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center items-center flex px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition text-sm">
                    <Printer className="h-4 w-4 mr-2" /> PDF
                 </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 sm:p-6 border-l-4 border-orange-500">
                <dt className="text-sm font-medium text-gray-500 truncate">Общая выручка</dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{totalRevenue.toLocaleString()} ₽</dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <dt className="text-sm font-medium text-gray-500 truncate">Всего заказов</dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{orders.length}</dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
                <dt className="text-sm font-medium text-gray-500 truncate">Выполнено</dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{orders.filter(o => o.status === OrderStatus.COMPLETED).length}</dd>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-break-inside">
               <div className="bg-white p-4 sm:p-6 shadow rounded-lg min-h-[300px]">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Выручка по услугам</h3>
                 <ResponsiveContainer width="100%" height={250}>
                   <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" hide />
                     <YAxis width={40} />
                     <Tooltip />
                     <Bar dataKey="value" fill="#FB4C03" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="bg-white p-4 sm:p-6 shadow rounded-lg min-h-[300px]">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение заказов</h3>
                 <ResponsiveContainer width="100%" height={250}>
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       labelLine={false}
                       outerRadius={80}
                       fill="#8884d8"
                       dataKey="count"
                       label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Детальный отчет транзакций</h3>
              </div>
              <div className="border-t border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клиент</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Услуга</th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Сумма</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {orders.map(order => (
                       <tr key={order.id}>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id.slice(-6)}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.clientName}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div className="max-w-[120px] truncate" title={order.serviceTitle}>{order.serviceTitle}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{order.amount.toLocaleString()} ₽</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {user.role === Role.CLIENT && renderClientView()}
      {user.role === Role.OPERATOR && renderOperatorView()}
      {user.role === Role.MANAGER && renderManagerView()}
    </div>
  );
};
