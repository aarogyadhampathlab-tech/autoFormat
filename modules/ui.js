(function (global) {
  const { balanceDLC, formatInputByRow } = global.AutoFormatter?.formatter || {};
  const { celebrationEffect } = global.AutoFormatter?.celebration || {};

  function injectStaticHub() {
    if (window.location.origin !== "http://192.168.1.143:1081") return;
    if (document.getElementById("master-static-btn")) return;

    const style = document.createElement("style");
    style.textContent = `
      #master-static-btn { transition: all 0.3s ease; }
      #master-static-btn:hover {
        transform: scale(1.1);
        background: #5bb8bf !important;
        box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
      }
      #master-static-btn:active {
        transform: scale(0.95);
        box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
      }
    `;
    document.head.appendChild(style);

    const fab = document.createElement("button");
    fab.id = "master-static-btn";
    fab.innerHTML = "😴";
    fab.style.cssText =
      "position:fixed; bottom:70px; right:40px; width:60px; height:60px; border-radius:50%; border:none; background:#71CFD6; color:white; font-size:24px; cursor:pointer; z-index:1000000; box-shadow:0 4px 10px rgba(0,0,0,0.2);";

    fab.addEventListener("mouseenter", () => {
      fab.innerHTML = "🙄";
    });
    fab.addEventListener("mouseleave", () => {
      fab.innerHTML = "😴";
    });
    fab.addEventListener("mousedown", () => {
      fab.innerHTML = "🥰";
    });
    fab.addEventListener("mouseup", () => {
      fab.innerHTML = "😀";
    });

    fab.onclick = () => {
      document.querySelectorAll("input._Result").forEach(formatInputByRow);
      balanceDLC();
      celebrationEffect();
    };

    document.body.appendChild(fab);
  }

  global.AutoFormatter = global.AutoFormatter || {};
  global.AutoFormatter.ui = { injectStaticHub };
})(window);
