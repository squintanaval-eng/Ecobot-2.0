```javascript
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const newChatBtn = document.getElementById("newChat");

// Aquí se guarda la conversación actual.
let conversationHistory = [];

chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const text = userInput.value.trim();

  if (!text) {
    return;
  }

  addMessage(text, "user");

  // Guardamos el mensaje del usuario en la memoria.
  conversationHistory.push({
    role: "user",
    parts: [
      {
        text
      }
    ]
  });

  userInput.value = "";
  userInput.disabled = true;

  const loadingMessage = addMessage(
    "EcoBot está pensando... 🌿",
    "bot"
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: conversationHistory
      })
    });

    const data = await response.json();

    const reply =
      data.reply ||
      data.error ||
      "No pude responder en este momento.";

    loadingMessage.querySelector(".bubble").textContent = reply;

    // Guardamos la respuesta de EcoBot en la memoria.
    if (data.reply) {
      conversationHistory.push({
        role: "model",
        parts: [
          {
            text: data.reply
          }
        ]
      });
    }
  } catch (error) {
    loadingMessage.querySelector(".bubble").textContent =
      "Hubo un error conectando con la inteligencia artificial.";
  } finally {
    userInput.disabled = false;
    userInput.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const avatarImg = document.createElement("img");
  avatarImg.classList.add(
    sender === "user" ? "user-avatar" : "bot-avatar",
    "chat"
  );

  avatarImg.src =
    sender === "user"
      ? "User pfp.webp"
      : "0fc99b96-e277-41a7-8444-7b1af90d04b7 (1).png";

  avatarImg.alt = sender === "user" ? "Usuario" : "EcoBot";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  message.appendChild(avatarImg);
  message.appendChild(bubble);

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;

  return message;
}

newChatBtn.addEventListener("click", function () {
  // Borra la memoria de la conversación.
  conversationHistory = [];

  // Borra los mensajes visibles.
  messages.innerHTML = "";

  addMessage(
    "¡Hola! Soy EcoBot 🌿 Estoy listo para ayudarte. ¿Qué te gustaría saber?",
    "bot"
  );

  userInput.value = "";
  userInput.focus();
});
```
