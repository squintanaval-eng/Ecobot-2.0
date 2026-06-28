const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = userInput.value.trim();

  if (text === "") return;

  addMessage(text, "user");
  userInput.value = "";

  setTimeout(() => {
    addMessage("Todavía estoy en modo diseño 🌿 Pronto podré responder con IA real.", "bot");
  }, 700);
});

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.remove();

const avatarImg = document.createElement("img");
avatarImg.classList.add(sender === "user" ? "user-avatar" : "bot-avatar");
avatarImg.classList.add("chat");

avatarImg.src = sender === "user"
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
}
