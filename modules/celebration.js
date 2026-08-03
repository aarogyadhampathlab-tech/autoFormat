(function (global) {
  function celebrationEffect() {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
    ];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
        pointer-events: none;
        z-index: 999999;
        opacity: 1;
        animation: fall ${Math.random() * 2 + 2}s linear forwards;
        --x-offset: ${Math.random() * 200 - 100}px;
      `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), (Math.random() * 2 + 2) * 1000);
    }

    if (!document.getElementById("celebration-styles")) {
      const style = document.createElement("style");
      style.id = "celebration-styles";
      style.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh) translateX(var(--x-offset)) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  global.AutoFormatter = global.AutoFormatter || {};
  global.AutoFormatter.celebration = { celebrationEffect };
})(window);
