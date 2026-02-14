
import { GoogleGenAI } from "@google/genai";
import { StockItem, Sale } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStoreData = async (stock: StockItem[], sales: Sale[], query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Eres un asistente inteligente para la tienda "Se Libre - Línea de Luz Interna".
        Tu tono debe ser amable, profesional y ligeramente inspirador, acorde a la marca (representada por una libélula, símbolo de transformación).
        
        Contexto de la tienda:
        - Inventario actual: ${JSON.stringify(stock)} (Incluye categorías de productos)
        - Ventas registradas: ${JSON.stringify(sales)}

        Pregunta del usuario: "${query}"

        Responde de forma concisa, útil y en español. Si te piden un análisis, identifica tendencias, problemas de stock (productos bajos o sin rotación) o resúmenes por categoría si el usuario lo solicita.
      `,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, no pude procesar esa información.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con el asistente inteligente.";
  }
};
