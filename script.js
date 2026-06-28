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
  avatar.textContent = sender === "user" ? "👤" : "🤖";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  message.appendChild(avatar);
  message.appendChild(bubble);

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}
