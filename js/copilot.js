// copilot.js

document.addEventListener("DOMContentLoaded", function () {
  // Create the toggle button (small icon)
  const toggleButton = document.createElement("div");
  toggleButton.id = "copilot-toggle";
  toggleButton.innerHTML = "🤖";
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    width: 50px;
    height: 50px;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9998;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toggleButton);

  // Create the full panel but keep it hidden initially
  const copilotPanel = document.createElement("div");
  copilotPanel.id = "copilot-panel";
  copilotPanel.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: 'Inter', sans-serif;
    display: none;
  `;

  copilotPanel.innerHTML = `
    <div style="padding: 10px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: 600;">
      Copilot Assistant
    </div>
    <div style="padding: 10px;">
      <textarea id="copilot-input" rows="3" placeholder="Ask me anything..." style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;"></textarea>
      <button id="copilot-send" style="margin-top: 10px; width: 100%; padding: 6px 10px; border-radius: 6px; background-color: #007bff; color: white; border: none;">Send</button>
      <div id="copilot-response" style="margin-top: 10px; font-size: 0.9rem; color: #333;"></div>
    </div>
  `;
  document.body.appendChild(copilotPanel);

  // Toggle the panel when the icon is clicked
  toggleButton.addEventListener("click", function () {
    if (copilotPanel.style.display === "none") {
      copilotPanel.style.display = "block";
    } else {
      copilotPanel.style.display = "none";
    }
  });

  // AI request logic
  document.getElementById("copilot-send").onclick = async function () {
    const inputText = document.getElementById("copilot-input").value;
    if (!inputText) return;

    const responseBox = document.getElementById("copilot-response");
    responseBox.innerText = "Thinking...";

    try {
      const response = await fetch("http://127.0.0.1:5000/copilot-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("user_token"),
        },
        body: JSON.stringify({ input: inputText }),
      });

      const data = await response.json();
      if (data.answer) {
        responseBox.innerText = data.answer;
      } else {
        responseBox.innerText = "No answer from AI.";
      }
    } catch (error) {
      responseBox.innerText = "Error contacting Copilot.";
    }
  };
});
