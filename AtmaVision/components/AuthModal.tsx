
import React, { useState } from 'react';
import { Role, User } from '../types';
import { loginUser, registerUser } from '../services/dataService';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // Default role is CLIENT for all new registrations
  const role = Role.CLIENT; 

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = loginUser(email, password);
      if (user) {
        onLoginSuccess(user);
        onClose();
      } else {
        setError('Неверный email или пароль');
      }
    } else {
      if (!name || !email || !password) {
        setError('Заполните все поля');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role
      };
      const result = registerUser(newUser);
      if (result.success) {
        onLoginSuccess(newUser);
        onClose();
      } else {
        setError(result.message || 'Ошибка регистрации');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md w-full relative z-10">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
               <X className="h-6 w-6" />
             </button>
          </div>
          
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              {isLogin ? 'Вход в систему' : 'Регистрация'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {!isLogin && (
               <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3 rounded mb-4">
                  Регистрация доступна только для Клиентов. Если вы сотрудник, обратитесь к менеджеру для смены роли.
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Имя</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md bg-white shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md bg-white shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Пароль</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md bg-white shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 font-medium text-orange-600 hover:text-orange-500"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
            
            {isLogin && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                <p>Тестовые аккаунты:</p>
                <p>Менеджер: admin@atma.vision / admin</p>
                <p>Оператор: operator@atma.vision / operator</p>
                <p>Клиент: sergey@example.com / client</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
