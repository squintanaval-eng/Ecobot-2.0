import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Falta la API Key de Gemini" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Eres EcoBot, un asistente amable, útil y claro.
Responde siempre en español.
Tu estilo debe ser cercano, natural y fácil de entender.
No respondas demasiado largo salvo que el usuario lo pida.

Usuario: ${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en EcoBot:", error);
    return res.status(500).json({
      error: "EcoBot tuvo un problema conectando con Gemini."
    });
  }
}
