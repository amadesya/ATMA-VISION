
import { Order, Service, OrderStatus, User, Role, Message } from '../types';

const SERVICES_KEY = 'atma_services';
const ORDERS_KEY = 'atma_orders';
const USERS_KEY = 'atma_users';
const SESSION_KEY = 'atma_session';
const MESSAGES_KEY = 'atma_messages';

// --- INITIAL DATA ---

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    title: 'IMAGE VISION | FPV-дрон съемка для спортцентров',
    description: 'Съемка вашего фитнес-центра на FPV-дрон одним непрерывным кадром — современная виртуальная экскурсия для привлечения клиентов.',
    price: 30000,
    category: 'Спорт',
    image: '',
    details: [
      '2 варианта съемки:',
      'Обзорная (30 000 ₽) — пролет по пустым залам, акцент на пространство и оборудование.',
      'Постановочная (от 65 000 ₽) — съемка с актерами/сотрудниками, показ атмосферы живого центра.'
    ]
  },
  {
    id: '2',
    title: 'Мини-квест "Ящик видеографа"',
    description: 'Посетитель сайта находит старинный деревянный ящик с надписью "ATMA VISION". Ящик принадлежал основателю студии - старому видеографу. Внутри лежат "ключи" к пониманию искусства видеосъемки.',
    price: 65000,
    category: 'Event',
    image: '',
    details: [
      'Сюжет: Ящик принадлежал основателю студии - старому видеографу. Внутри лежат "ключи" к пониманию искусства видеосъемки.',
      'Этапы квеста:',
      '1. Первая находка: Старая кассета VHS',
      '• Нужно "проявить" её (навести курсор)'
    ]
  },
  {
    id: '3',
    title: 'ВИДЕОСЪЕМКА OT ATMA VISION',
    description: 'Запечатлеем самые яркие моменты ваших приключений, праздников и важных событий!',
    price: 45000,
    category: 'Праздник',
    image: ''
  },
  {
    id: '4',
    title: 'Корпоративный имиджевый фильм',
    description: 'Презентационный фильм о вашей компании. Покажем масштаб, ценности и команду. Идеально для сайта и переговоров.',
    price: 150000,
    category: 'Бизнес',
    image: '',
    details: [
       'Разработка сценария и раскадровка',
       'Съемка 2-3 смены (офис, производство)',
       'Интервью с руководителями и сотрудниками',
       'Аэросъемка объектов',
       'Профессиональная озвучка и инфографика'
    ]
  },
  {
    id: '5',
    title: 'Свадебная видеосъемка "Премиум"',
    description: 'Многокамерная съемка вашего главного дня. Создаем кинематографичный фильм о вашей любви.',
    price: 80000,
    category: 'Свадьба',
    image: '',
    details: [
       'Работа двух операторов (10 часов)',
       'Аэросъемка прогулки',
       'SDE (монтаж ролика в день свадьбы для показа на банкете)',
       'Свадебный фильм (20-40 мин) и клип (3-5 мин)',
       'Цветокоррекция уровня кино'
    ]
  },
  {
    id: '6',
    title: 'Пакет Reels/Shorts "Быстрый старт"',
    description: 'Съемка профессионального контента для социальных сетей на месяц вперед. Забудьте о проблеме "что выложить".',
    price: 25000,
    category: 'SMM',
    image: '',
    details: [
       'Разработка контент-плана (10 роликов)',
       'Студийная или выездная съемка (до 3 часов)',
       'Динамичный монтаж, трендовая музыка, титры',
       'Адаптация под все вертикальные форматы'
    ]
  },
  {
    id: '7',
    title: 'Видеообзор недвижимости',
    description: 'Продающий ролик для риелторов и застройщиков. Повышает конверсию объявлений в 2 раза.',
    price: 15000,
    category: 'Недвижимость',
    image: '',
    details: [
       'Динамичный монтаж (до 2 мин)',
       'Широкоугольная съемка интерьера',
       'Акцент на преимуществах планировки и вида',
       'Текстовые плашки с характеристиками',
       'Готовность через 48 часов'
    ]
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Главный Менеджер',
    email: 'admin@atma.vision',
    password: 'admin',
    role: Role.MANAGER
  },
  {
    id: 'operator-1',
    name: 'Иван Оператор',
    email: 'operator@atma.vision',
    password: 'operator',
    role: Role.OPERATOR
  },
  {
    id: 'operator-2',
    name: 'Елена Камера',
    email: 'elena@atma.vision',
    password: 'operator',
    role: Role.OPERATOR
  },
  {
    id: 'client-1',
    name: 'Анна Клиент',
    email: 'client@atma.vision',
    password: 'client',
    role: Role.CLIENT
  },
  {
    id: 'client-2',
    name: 'Сергей Петров',
    email: 'sergey@example.com',
    password: 'client',
    role: Role.CLIENT
  },
  {
    id: 'client-3',
    name: 'Мария Смирнова',
    email: 'maria@example.com',
    password: 'client',
    role: Role.CLIENT
  },
  {
    id: 'client-4',
    name: 'ООО "ТехноСтрой"',
    email: 'info@technostroy.ru',
    password: 'client',
    role: Role.CLIENT
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    clientId: 'client-1',
    serviceId: '3',
    serviceTitle: 'ВИДЕОСЪЕМКА OT ATMA VISION',
    clientName: 'Анна Клиент',
    clientContact: 'client@atma.vision',
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    status: OrderStatus.COMPLETED,
    amount: 45000,
    createdAt: Date.now() - 86400000 * 5,
    operatorId: 'operator-1',
    operatorName: 'Иван Оператор'
  },
  {
    id: 'ord-1002',
    clientId: 'client-1',
    serviceId: '1',
    serviceTitle: 'IMAGE VISION | FPV-дрон съемка для спортцентров',
    clientName: 'Анна Клиент',
    clientContact: 'client@atma.vision',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: OrderStatus.ACCEPTED,
    amount: 30000,
    createdAt: Date.now() - 86400000 * 2,
    operatorId: 'operator-2',
    operatorName: 'Елена Камера'
  },
  {
    id: 'ord-1003',
    clientId: 'client-2',
    serviceId: '5',
    serviceTitle: 'Свадебная видеосъемка "Премиум"',
    clientName: 'Сергей Петров',
    clientContact: 'sergey@example.com',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: OrderStatus.COMPLETED,
    amount: 80000,
    createdAt: Date.now() - 86400000 * 10,
    operatorId: 'operator-1',
    operatorName: 'Иван Оператор'
  },
  {
    id: 'ord-1004',
    clientId: 'client-2',
    serviceId: '7',
    serviceTitle: 'Видеообзор недвижимости',
    clientName: 'Сергей Петров',
    clientContact: 'sergey@example.com',
    date: new Date().toISOString(),
    status: OrderStatus.ACCEPTED,
    amount: 15000,
    createdAt: Date.now(),
    operatorId: 'operator-1',
    operatorName: 'Иван Оператор'
  },
  {
    id: 'ord-1005',
    clientId: 'client-4',
    serviceId: '4',
    serviceTitle: 'Корпоративный имиджевый фильм',
    clientName: 'ООО "ТехноСтрой"',
    clientContact: '+7 (900) 123-45-67',
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: OrderStatus.COMPLETED,
    amount: 150000,
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'ord-1006',
    clientId: 'client-4',
    serviceId: '6',
    serviceTitle: 'Пакет Reels/Shorts "Быстрый старт"',
    clientName: 'ООО "ТехноСтрой"',
    clientContact: 'marketing@technostroy.ru',
    date: new Date(Date.now() - 3600000).toISOString(),
    status: OrderStatus.PENDING,
    amount: 25000,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'ord-1007',
    clientId: 'client-3',
    serviceId: '2',
    serviceTitle: 'Мини-квест "Ящик видеографа"',
    clientName: 'Мария Смирнова',
    clientContact: 'maria@example.com',
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: OrderStatus.CANCELLED,
    amount: 65000,
    createdAt: Date.now() - 86400000 * 30
  }
];

const INITIAL_MESSAGES: Message[] = [
    {
        id: 'msg-1',
        orderId: 'ord-1002',
        senderId: 'client-1',
        senderName: 'Анна Клиент',
        text: 'Добрый день! Подскажите, нужна ли какая-то подготовка зала перед съемкой?',
        timestamp: Date.now() - 86400000 * 2 + 3600000,
        isRead: true
    },
    {
        id: 'msg-2',
        orderId: 'ord-1002',
        senderId: 'operator-2',
        senderName: 'Елена Камера',
        text: 'Здравствуйте! Да, желательно убрать лишние предметы с пола и включить всё освещение. Также, если есть фирменная форма у тренеров, лучше, чтобы они были в ней.',
        timestamp: Date.now() - 86400000 * 2 + 7200000,
        isRead: true
    },
    {
        id: 'msg-3',
        orderId: 'ord-1002',
        senderId: 'client-1',
        senderName: 'Анна Клиент',
        text: 'Поняла, спасибо! А сколько примерно займет монтаж? Нам бы хотелось получить видео к следующей пятнице.',
        timestamp: Date.now() - 86400000 * 2 + 10800000,
        isRead: true
    },
    {
        id: 'msg-4',
        orderId: 'ord-1002',
        senderId: 'operator-2',
        senderName: 'Елена Камера',
        text: 'Да, конечно. Мы успеем сделать черновой монтаж уже к среде, чтобы у вас было время на правки. К пятнице финал будет готов!',
        timestamp: Date.now() - 86400000 * 2 + 14400000,
        isRead: true
    },
    // Sergey (Client-2) and Ivan (Operator-1) Dialog for ord-1004
    {
        id: 'msg-10',
        orderId: 'ord-1004',
        senderId: 'client-2',
        senderName: 'Сергей Петров',
        text: 'Здравствуйте! Оформил заявку на обзор квартиры. Подскажите, когда сможете подъехать?',
        timestamp: Date.now() - 3600000 * 5, // 5 hours ago
        isRead: true
    },
    {
        id: 'msg-11',
        orderId: 'ord-1004',
        senderId: 'operator-1',
        senderName: 'Иван Оператор',
        text: 'Добрый день, Сергей! Я назначен на ваш заказ. Могу завтра, ориентировочно в 12:00. Вам удобно?',
        timestamp: Date.now() - 3600000 * 4,
        isRead: true
    },
    {
        id: 'msg-12',
        orderId: 'ord-1004',
        senderId: 'client-2',
        senderName: 'Сергей Петров',
        text: 'Да, в 12 отлично. Адрес: ул. Пушкина, д. 10, кв. 55. Код домофона 55В.',
        timestamp: Date.now() - 3600000 * 3.5,
        isRead: true
    },
    {
        id: 'msg-13',
        orderId: 'ord-1004',
        senderId: 'operator-1',
        senderName: 'Иван Оператор',
        text: 'Принято. Пожалуйста, подготовьте помещение: уберите личные вещи и обеспечьте максимальное освещение.',
        timestamp: Date.now() - 3600000 * 3,
        isRead: true
    },
    {
        id: 'msg-14',
        orderId: 'ord-1004',
        senderId: 'client-2',
        senderName: 'Сергей Петров',
        text: 'Хорошо, всё сделаем. До встречи!',
        timestamp: Date.now() - 3600000 * 2.8,
        isRead: true
    }
];

// --- AUTH SERVICES ---

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const getAllUsers = (): User[] => {
  return getUsers();
};

export const getOperators = (): User[] => {
    return getUsers().filter(u => u.role === Role.OPERATOR);
}

export const registerUser = (user: User): { success: boolean; message?: string } => {
  const users = getUsers();
  if (users.find(u => u.email === user.email)) {
    return { success: false, message: 'Пользователь с таким email уже существует' };
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Auto login after register
  const safeUser = { ...user };
  delete safeUser.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return { success: true };
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const safeUser = { ...user };
    delete safeUser.password; // Don't store password in session
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const updateUserRole = (userId: string, newRole: Role) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].role = newRole;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update session if the current user is modifying themselves (edge case)
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
       const updatedUser = { ...users[index] };
       delete updatedUser.password;
       localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    }
  }
};

// --- DATA SERVICES ---

export const getServices = (): Service[] => {
  const stored = localStorage.getItem(SERVICES_KEY);
  if (!stored) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  }
  return JSON.parse(stored);
};

export const getServiceCategories = (): string[] => {
  const services = getServices();
  const categories = new Set(services.map(s => s.category));
  return Array.from(categories).sort();
}

export const addService = (service: Service) => {
  const services = getServices();
  services.push(service);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const getOrders = (user?: User | null): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  let allOrders: Order[] = [];
  
  if (!stored) {
    // Seed initial orders if none exist
    allOrders = INITIAL_ORDERS;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  } else {
    allOrders = JSON.parse(stored);
  }

  if (!user) return [];

  if (user.role === Role.CLIENT) {
    return allOrders.filter(o => o.clientId === user.id);
  }
  
  // Managers and Operators see all orders
  return allOrders;
};

export const createOrder = (order: Order) => {
  const orders = getOrders({ role: Role.MANAGER } as User); // Get all raw orders to append
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (stored) {
    const orders: Order[] = JSON.parse(stored);
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }
};

export const assignOperator = (orderId: string, operatorId: string) => {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (stored) {
    const orders: Order[] = JSON.parse(stored);
    const index = orders.findIndex(o => o.id === orderId);
    
    // Find operator name
    const users = getUsers();
    const operator = users.find(u => u.id === operatorId);

    if (index !== -1) {
      orders[index].operatorId = operatorId || undefined;
      orders[index].operatorName = operator ? operator.name : undefined;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }
}

export const deleteOrder = (orderId: string) => {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) {
        const orders: Order[] = JSON.parse(stored);
        const newOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    }
}

// --- MESSAGING SERVICES ---

export const getMessages = (): Message[] => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (!stored) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
        return INITIAL_MESSAGES;
    }
    return JSON.parse(stored);
}

export const getMessagesForOrder = (orderId: string): Message[] => {
    const messages = getMessages();
    return messages.filter(m => m.orderId === orderId).sort((a,b) => a.timestamp - b.timestamp);
}

export const sendMessage = (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const messages = getMessages();
    const newMessage: Message = {
        ...msg,
        id: 'msg-' + Date.now(),
        timestamp: Date.now(),
        isRead: false
    };
    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return newMessage;
}
