import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No se recibió mensaje" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Eres EcoBot, un asistente amable, claro y útil.
Responde en español de forma natural.
No seas demasiado largo salvo que el usuario lo pida.

Usuario: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return res.status(200).json({ reply: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error al conectar con Gemini"
    });
  }
}
