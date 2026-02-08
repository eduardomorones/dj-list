
import { GoogleGenAI } from "@google/genai";
import { DancerProfile } from "../types";

export const getMusicAdvice = async (dancers: DancerProfile[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const dancersSummary = dancers.map(d => ({
    name: d.stageName,
    sets: d.sets.map(s => s.songs.map(song => `${song.title} - ${song.artist}`))
  }));

  const prompt = `Actúa como un DJ profesional experimentado. Tengo la siguiente lista de bailarinas y sus canciones para 3 sets (cada set tiene 2 canciones). 
  
  Datos: ${JSON.stringify(dancersSummary)}
  
  Por favor, proporciona:
  1. Sugerencias de orden para que el flujo de la noche sea energético.
  2. Ideas de transiciones breves entre las canciones más contrastantes.
  3. Si alguna canción parece fuera de lugar para un show de baile, menciónalo discretamente.
  Responde en español, con un tono cool de DJ nocturno.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con el asistente DJ virtual. Revisa tu conexión.";
  }
};
