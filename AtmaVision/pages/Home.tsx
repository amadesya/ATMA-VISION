import React from 'react';
import { Service } from '../types';
import { CheckCircle, Users, Clock, Shield } from 'lucide-react';
import image1 from './img/image1.png';

interface HomeProps {
  onOrder?: (service: Service) => void;
  navigateToServices: () => void;
}

export const Home: React.FC<HomeProps> = ({ navigateToServices }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center bg-white min-h-screen">
        <div className="lg:w-1/2 px-6 sm:px-12 lg:px-16 mt-20 lg:mt-0 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
            <span className="block xl:inline">КРЕАТИВНЫЙ ВИДЕО-</span>
            <span className="block text-orange-600 xl:inline">ПРОДАКШН</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-500 max-w-xl">
            Создаем коммерческий и брендовый контент для компаний, артистов, музыкантов и рекламных агентств уже более 10 лет.
          </p>
          <button
            onClick={navigateToServices}
            className="mt-6 px-6 py-3 md:px-10 md:py-4 bg-orange-600 text-white font-medium rounded-md shadow hover:bg-orange-700"
          >
            Узнать больше и заказать
          </button>
        </div>
      <div className="lg:w-1/2 w-full h-96 sm:h-[800px] lg:h-[600px] mt-8 lg:mt-0">
          <img
            src={image1}
            alt="Hero"
            className="w-full h-full object-cover grayscale rounded-lg"
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">ПОЧЕМУ ВЫБИРАЮТ НАС</h2>
            <p className="text-gray-500 mt-2">Мы предлагаем лучшие условия для наших клиентов</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <CheckCircle className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 uppercase">КАЧЕСТВО</h3>
              <p className="text-sm text-gray-500 mt-2">Гарантируем высокое качество всех наших услуг</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Users className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 uppercase">ОПЫТНАЯ КОМАНДА</h3>
              <p className="text-sm text-gray-500 mt-2">Профессионалы с многолетним опытом работы</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Shield className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 uppercase">НАДЕЖНОСТЬ</h3>
              <p className="text-sm text-gray-500 mt-2">Более 1000 успешно реализованных проектов</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Clock className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 uppercase">ОПЕРАТИВНОСТЬ</h3>
              <p className="text-sm text-gray-500 mt-2">Быстрое выполнение заказов в срок</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="py-12 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 w-full">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Team working"
            className="rounded-lg shadow-xl"
          />
        </div>
        <div className="md:w-1/2 w-full">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 uppercase">О НАШЕЙ КОМПАНИИ</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>Мы работаем на рынке с 2010 года и за это время успели заработать отличную репутацию среди наших клиентов.</p>
            <p>Наша команда состоит из высококвалифицированных специалистов, которые постоянно повышают квалификацию и следят за новыми тенденциями в индустрии.</p>
            <p>Мы гордимся тем, что можем предложить индивидуальный подход и гарантию качества на все виды услуг.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-orange-600">1000+</span>
              <span className="text-xs text-gray-500 uppercase">ПРОЕКТОВ</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-orange-600">500+</span>
              <span className="text-xs text-gray-500 uppercase">КЛИЕНТОВ</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-orange-600">10+</span>
              <span className="text-xs text-gray-500 uppercase">ЛЕТ ОПЫТА</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
