(function (global) {
  const { TEST_RULES, URINE_FILL_IDS, LINKED_ROW_IDS } = global.AutoFormatter?.rules || {};
  const { formatInputByRow } = global.AutoFormatter?.formatter || {};
  const { celebrationEffect } = global.AutoFormatter?.celebration || {};

  function fillUrineDefaults() {
    URINE_FILL_IDS.forEach((id) => {
      const row = document.querySelector(`tr[p="${id}"]`);
      const input = row?.querySelector("input._Result");
      if (input && TEST_RULES[id]?.value) {
        input.value = TEST_RULES[id].value;
        delete input.dataset.formatted;
      }
    });
  }

  function refreshLinkedRows(pID) {
    const ids = LINKED_ROW_IDS[pID] || [];
    ids.forEach((id) => {
      const row = document.querySelector(`tr[p="${id}"]`);
      const targetInput = row?.querySelector("input._Result");
      if (targetInput) formatInputByRow(targetInput);
    });
  }

  function addMagicWands() {
    document.querySelectorAll("input._Result").forEach((input) => {
      const pID = input.closest("tr")?.getAttribute("p");

      if (TEST_RULES[pID]?.hasTrigger && !input.parentElement.querySelector(".format-btn")) {
        const button = document.createElement("button");
        button.innerText = "🔥";
        button.className = "format-btn";
        button.style.cssText =
          "margin-left:8px; cursor:pointer; border-radius:4px; border:1px solid #ccc; background:#fff; font-size:10px; padding:2px 4px;";
        input.parentElement.appendChild(button);

        button.onclick = (event) => {
          event.preventDefault();

          if (pID === "642") fillUrineDefaults();
          formatInputByRow(input);

          setTimeout(() => {
            if (pID === "137") refreshLinkedRows("137");
            else if (pID === "629") refreshLinkedRows("629");
            else if (pID === "440") refreshLinkedRows("440");
            else if (pID === "642") refreshLinkedRows("642");
            celebrationEffect();
          }, 50);
        };
      }
    });
  }

  function addManualTriggers() {
    document.querySelectorAll("input._Result").forEach((input) => {
      const pID = input.closest("tr")?.getAttribute("p");
      const rule = TEST_RULES[pID];

      if (rule?.isManual && !input.parentElement.querySelector(".manual-fill-btn")) {
        const button = document.createElement("button");
        button.innerText = "🔥";
        button.className = "manual-fill-btn";
        button.style.cssText =
          "margin-left:8px; cursor:pointer; border-radius:4px; border:1px solid #ccc; background:#fff3e0; font-size:10px; padding:2px 4px;";

        input.parentElement.appendChild(button);

        button.onclick = (event) => {
          event.preventDefault();

          if (pID === "642") fillUrineDefaults();
          formatInputByRow(input);

          setTimeout(() => {
            if (pID === "629") refreshLinkedRows("629");
            else if (pID === "440") refreshLinkedRows("440");
            else if (pID === "642") refreshLinkedRows("642");
            celebrationEffect();
          }, 50);
        };
      }
    });
  }

  global.AutoFormatter = global.AutoFormatter || {};
  global.AutoFormatter.triggerButtons = { addMagicWands, addManualTriggers };
})(window);
