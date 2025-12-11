import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse } from "../types";

const FALLBACK_POEMS = [
  "Em cada traço do teu sorriso vejo a arte, no nosso abraço meu mundo encontra sua melhor parte.",
  "Melhor que qualquer livro na estante, nosso beijo escreve uma história de amor fascinante.",
  "Neste corredor iluminado encontrei meu lugar, você é a luz que eu sempre quis alcançar.",
  "No reflexo do espelho, vejo nós dois, um amor para hoje, amanhã e todo o depois."
];

export const generateRomanticPoems = async (): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, using fallback poems.");
    return FALLBACK_POEMS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prompts ajustados especificamente para as fotos fornecidas
    const prompt = `
      Escreva 4 poemas curtos (máximo 4 linhas cada) e muito românticos em Português para minha namorada.
      
      Contexto específico para cada poema (baseado nas fotos):
      
      1. Foto: Uma selfie nossa bem de perto, sorrindo com os rostos colados.
         Tema: Arte e Beleza. Compare o sorriso dela e nossa felicidade a uma obra de arte (estilo Van Gogh/Noite Estrelada).
      
      2. Foto: Nós nos beijando em uma livraria/biblioteca, cercados de livros.
         Tema: Livros e Ficção. Referência a "Melhor que nos filmes" (Better Than the Movies) ou romances literários. Diga que nossa história é melhor que qualquer livro daquela estante.
      
      3. Foto: Nós nos beijando em um corredor branco e bem iluminado.
         Tema: Luz e "Enrolados" (Rapunzel). Fale sobre encontrar a luz/lanterna flutuante e como ela ilumina meu caminho.
      
      4. Foto: Uma selfie nossa no espelho, de corpo inteiro, abraçados (ela tirando a foto).
         Tema: Nós dois, Parceria e Futuro. Fale sobre o reflexo mostrar um casal perfeito e um amor para a vida toda.

      Retorne APENAS um JSON com um array de strings contendo os 4 poemas.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as GenerationResponse;
    
    if (result.poems && result.poems.length === 4) {
      return result.poems;
    }
    
    return FALLBACK_POEMS;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return FALLBACK_POEMS;
  }
};