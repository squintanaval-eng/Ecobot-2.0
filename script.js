const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const loadingMessage = addMessage("EcoBot está pensando... 🌿", "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    loadingMessage.querySelector(".bubble").textContent =
      data.reply || data.error || "No pude responder ahora mismo.";
  } catch (error) {
    loadingMessage.querySelector(".bubble").textContent =
      "Hubo un error conectando con la IA.";
  }
});

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const avatarImg = document.createElement("img");
  avatarImg.classList.add(sender === "user" ? "user-avatar" : "bot-avatar");
  avatarImg.classList.add("chat");

  avatarImg.src = sender === "user"
    ? "Usuario pfp.webp"
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
