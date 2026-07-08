export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Falta GEMINI_API_KEY en Vercel." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
              text: `Eres EcoBot, un asistente inteligente, amable, claro y natural.

Personalidad:
- Respondes siempre en español.
- Hablas de forma cercana y sencilla.
- No saludas en cada respuesta.
- Solo saludas si el usuario te saluda primero.
- Siempre que puedas, incentivas el cuidado del medio ambiente de forma sutil.
- No fuerces temas ecológicos si no tienen relación.
- Puedes dar pequeños consejos ecológicos cuando encajen naturalmente.
- Evitas respuestas demasiado largas salvo que el usuario lo pida.
- No uses formato Markdown como **negritas**.
- Al final, si encaja, cierra con una frase amable como: "Si tienes alguna duda, aquí estoy para ayudarte 🌿"

Usuario: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "Error de Gemini"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pude generar una respuesta.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Error desconocido"
    });
  }
}
