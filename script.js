const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const newChatBtn = document.getElementById("newChat");

let conversationHistory = [];

chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");

  conversationHistory.push({
    role: "user",
    parts: [{ text: text }]
  });

  userInput.value = "";
  userInput.disabled = true;

  const loadingMessage = addMessage("EcoBot está pensando... 🌿", "bot");
  const loadingBubble = loadingMessage.querySelector(".bubble");

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

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("El servidor devolvió una respuesta inválida.");
    }

    if (!response.ok) {
      throw new Error(data.error || "Error al conectar con Gemini.");
    }

    const reply = data.reply || "No pude generar una respuesta.";

    loadingBubble.textContent = reply;

    conversationHistory.push({
      role: "model",
      parts: [{ text: reply }]
    });
  } catch (error) {
    console.error(error);
    loadingBubble.textContent =
      "Error: " + (error.message || "No pude conectar con la IA.");
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

if (newChatBtn) {
  newChatBtn.addEventListener("click", function () {
    conversationHistory = [];
    messages.innerHTML = "";

    addMessage(
      "¡Hola! Soy EcoBot 🌿 ¿En qué puedo ayudarte hoy?",
      "bot"
    );

    userInput.value = "";
    userInput.focus();
  });
}
