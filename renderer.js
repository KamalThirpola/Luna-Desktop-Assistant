/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function askAI(message) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    console.log(result);

    return result.candidates[0].content.parts[0].text;

  } catch (err) {
    console.error(err);
    return "Error: " + err.message;
  }
}
document.body.innerHTML = `
<div class="chat-layout">

  <div class="sidebar">
    <h2>🌙 Luna</h2>

    <button>+ New Chat</button>

    <p>Conversation 1</p>
    <p>Conversation 2</p>
  </div>

  <div class="chat-area">
    <h1>Welcome to Luna</h1>

    <div id="messages">
      <p><b>Luna:</b> Hello! How can I help you today?</p>
    </div>

    <input
      type="text"
      id="message"
      placeholder="Type your message..."
    />

    <button id="sendBtn">Send</button>
  </div>

</div>
`;
const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", async () => {

    const text = input.value.trim();

    if (!text) return;

    messages.innerHTML += `
      <p><b>You:</b> ${text}</p>
    `;

    input.value = "";

    messages.innerHTML += `
      <p id="loading"><b>Luna:</b> Thinking...</p>
    `;

    const reply = await askAI(text);

    document.getElementById("loading").remove();

    messages.innerHTML += `
      <p><b>Luna:</b> ${reply}</p>
    `;

});
