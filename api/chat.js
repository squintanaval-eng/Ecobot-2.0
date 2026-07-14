export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "No se recibió la conversación."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "No se encontró GEMINI_API_KEY en Vercel."
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: messages,
          systemInstruction: {
            parts: [
              {
                text: `Eres EcoBot, un asistente amable, claro y útil.

Responde siempre en español.
Recuerda el contexto de la conversación.
No saludes en cada respuesta.
Solo saluda cuando el usuario te salude.
Promueve el cuidado del medio ambiente cuando encaje naturalmente.
No uses asteriscos dobles ni títulos con almohadillas.
Responde de manera cercana y sencilla.`
              }
            ]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Error al comunicarse con Gemini."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(500).json({
        error: "Gemini no devolvió una respuesta."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message || "Error desconocido."
    });
  }
}

