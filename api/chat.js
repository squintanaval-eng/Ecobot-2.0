```javascript
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
        error: "No se recibió el historial de conversación."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta GEMINI_API_KEY en Vercel."
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
          systemInstruction: {
            parts: [
              {
                text: `Eres EcoBot, un asistente inteligente, amable y claro.

Reglas:
- Responde siempre en español.
- Recuerda y utiliza el contexto de los mensajes anteriores.
- No saludes en cada respuesta.
- Solo saluda si el usuario te saluda primero.
- Responde de forma cercana, sencilla y útil.
- Siempre que encaje naturalmente, incentiva el cuidado del medio ambiente.
- No fuerces temas ecológicos cuando no tengan relación.
- No uses Markdown como asteriscos dobles o títulos con almohadillas.
- Si encaja, termina invitando al usuario a seguir preguntando.`
              }
            ]
          },
          contents: messages,
          generationConfig: {
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

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("")
        .trim() ||
      "No pude generar una respuesta.";

    return res.status(200).json({
      reply
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Error desconocido."
    });
  }
}
```
