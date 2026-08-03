/** @format */

(function (global) {
  const { addMagicWands, addManualTriggers } = global.AutoFormatter?.triggerButtons || {};
  const { injectStaticHub } = global.AutoFormatter?.ui || {};

  function init() {
    if (window.location.origin !== "http://192.168.1.143:1081") return;

    if (typeof injectStaticHub === "function") injectStaticHub();
    if (typeof addMagicWands === "function") {
      addMagicWands();
      setInterval(addMagicWands, 250);
    }
    if (typeof addManualTriggers === "function") {
      addManualTriggers();
      setInterval(addManualTriggers, 250);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(window);

