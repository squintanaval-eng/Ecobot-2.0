const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const newChatBtn = document.getElementById("newChat");

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const text = userInput.value.trim();

  if (!text) {
    return;
  }

  addMessage(text, "user");
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
        message: text
      })
    });

    const data = await response.json();

    const reply =
      data.reply ||
      data.error ||
      "No pude responder en este momento.";

    loadingMessage.querySelector(".bubble").textContent = reply;
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
  messages.innerHTML = "";

  addMessage(
    "¡Hola! Soy EcoBot 🌿 Estoy listo para ayudarte. ¿Qué te gustaría saber?",
    "bot"
  );

  userInput.value = "";
  userInput.focus();
});
