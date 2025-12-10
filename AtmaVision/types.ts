
export enum Role {
  CLIENT = 'CLIENT',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER'
}

export enum OrderStatus {
  PENDING = 'В обработке',
  ACCEPTED = 'В работе',
  COMPLETED = 'Выполнен',
  CANCELLED = 'Отменен'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string; // Only for mock auth logic
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number; // in Rubles
  image: string; // Used for fallback or specific logic
  category: string;
  details?: string[]; // Extra details for the card
}

export interface Order {
  id: string;
  clientId: string; // Link to User
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientContact: string;
  date: string;
  status: OrderStatus;
  amount: number;
  createdAt: number;
  operatorId?: string; // ID of the assigned operator
  operatorName?: string; // Name of the assigned operator
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  revenueByService: { name: string; value: number }[];
}