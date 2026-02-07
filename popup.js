/** @format */

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");
  const userColor = document.getElementById("userColor");
  const userDecimals = document.getElementById("userDecimals");

  // Load existing settings
  chrome.storage.sync.get(["prefColor", "prefDecimals"], (data) => {
    if (data.prefColor) userColor.value = data.prefColor;
    if (data.prefDecimals) userDecimals.value = data.prefDecimals;
  });

  // Save logic
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      chrome.storage.sync.set(
        {
          prefColor: userColor.value,
          prefDecimals: userDecimals.value,
        },
        () => {
          alert("Settings saved! Refresh the page to apply.");
        },
      );
    });
  }
});
