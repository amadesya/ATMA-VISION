import { GoogleGenAI } from "@google/genai";
import { Order, Service } from "../types";

const apiKey = process.env.API_KEY || '';

export const analyzeBusinessData = async (orders: Order[], services: Service[]): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  const ai = new GoogleGenAI({ apiKey });

  // Prepare data summary for the AI
  const dataSummary = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
    recentOrders: orders.slice(-10),
    serviceList: services.map(s => s.title)
  };

  const prompt = `
    Ты - опытный бизнес-аналитик для видеопродакшн студии "ATMA VISION".
    Проанализируй следующие данные о заказах и услугах (в формате JSON):
    
    ${JSON.stringify(dataSummary, null, 2)}

    Пожалуйста, предоставь краткий отчет на русском языке, включающий:
    1. Общую оценку эффективности продаж.
    2. Какая услуга кажется наиболее популярной (или какая категория).
    3. Рекомендации по увеличению выручки на основе этих данных.
    4. Если данных мало, предложи стратегии маркетинга для видеостудии.

    Ответ должен быть профессиональным, но понятным, с использованием Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Не удалось получить ответ от AI.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Произошла ошибка при анализе данных. Проверьте API ключ.";
  }
};