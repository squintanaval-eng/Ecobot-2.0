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
      return res.status(500).json({
        error: "No se encontró GEMINI_API_KEY en Vercel."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
model: "gemini-3.5-flash"
    });

    const result = await model.generateContent(
      `Responde en español como EcoBot, amable y claro: ${message}`
    );

    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Error desconocido con Gemini"
    });
  }
}
