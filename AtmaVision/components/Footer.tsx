
import React from 'react';
import { Instagram, Youtube} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 py-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">ATMA VISION</h3>
            <p className="text-gray-500 text-sm">
              Профессиональные услуги видеосъемки для вашего бизнеса и личных событий.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Услуги</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>FPV-дрон съемка</li>
              <li>Мини-квест</li>
              <li>Видеосъемка</li>
              <li>Монтаж</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Компания</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>О нас</li>
              <li>Преимущества</li>
              <li>Контакты</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Контакты</h3>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>+7 (915) 047-84-13</li>
              <li>menshikovayana8@gmail.com</li>
              <li>9:00 - 19:00 (Пн - Сб)</li>
            </ul>
            <div className="flex space-x-4 mt-4">
               <a 
                 href="https://instagram.com/ioanna_create?igshid=NGExMmI2YTkyZg==" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-pink-600 p-2 rounded-full text-white hover:bg-pink-700 transition-colors"
                 title="Instagram"
               >
                 <Instagram size={16} />
               </a>
               <a 
                 href="https://www.youtube.com/@atma-vision/shorts" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-colors"
                 title="YouTube"
               >
                 <Youtube size={16} />
               </a>
               <a
  href="https://t.me/ioanna_dir"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
  title="Telegram"
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <title>Telegram icon</title>
    <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z"/>
  </svg>
</a>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
