/** @format */

const TEST_RULES = {
  // ... (CBC, KFT, LFT rules remain the same) ...
  390: { decimals: 1 },
  773: { decimals: 0, comma: true, factor: 1000 },
  643: { decimals: 2 },
  597: { decimals: 2, factor: 0.01 },
  573: { decimals: 1 },
  559: { decimals: 0 },
  516: { decimals: 0, pad: true },
  293: { decimals: 0, pad: true, isCalculated: true },
  544: { decimals: 0, pad: true },
  108: { decimals: 0, pad: true },
  276: { ignore: true },
  137: { decimals: 0 },
  138: { decimals: 1, isCalculated: true, hasTrigger: true },
  680: { decimals: 2 },
  768: { decimals: 2 },
  220: { decimals: 2, isCalculated: true },
  798: { decimals: 2, isCalculated: true },
  629: { decimals: 1, hasTrigger: true },
  628: { decimals: 1, isCalculated: true },
  482: { decimals: 1, isCalculated: true },
  468: { ignore: true },
  474: { decimals: 2, isCalculated: true },

  // --- VIRAL MARKERS (Fixed Trigger Mapping) ---
  440: { name: "HIV MAIN", isText: true, hasTrigger: true },
  439: { name: "HIV I", isText: true, value: "NON REACTIVE" },
  438: { name: "HIV II", isText: true, value: "NON REACTIVE" },
  397: { name: "HBsAg", isText: true, value: "NON REACTIVE" },
  401: { name: "HCV", isText: true, value: "NON REACTIVE" },
};

function getValueByPid(id) {
  const r = document.querySelector(`tr[p="${id}"]`);
  const i = r?.querySelector("input._Result");
  return i ? parseFloat(i.value.replace(/[^\d.-]/g, "")) || 0 : 0;
}

function formatInputByRow(input) {
  const row = input.closest("tr");
  const pID = row?.getAttribute("p");
  const rule = TEST_RULES[pID];
  if (!rule || rule.ignore) {
    if (pID === "468") input.value = "";
    return;
  }

  // Overrides & Auto-fills
  if (pID === "108") input.value = "00";
  if (pID === "628") input.value = "13.5";
  if (pID === "482") input.value = "1.1";
  if (rule.isText && rule.value) input.value = rule.value; // Explicitly fill text

  // Calculations
  if (rule.isCalculated || pID === "220") {
    if (pID === "220" && getValueByPid("220") === 0) input.value = "0.20";
    else if (pID === "293") {
      let b =
        100 -
        (Math.round(getValueByPid("559")) +
          Math.round(getValueByPid("516")) +
          Math.round(getValueByPid("544")));
      input.value = (b < 1 ? 1 : b).toString().padStart(2, "0");
    } else if (pID === "138")
      input.value = (getValueByPid("137") / 2.14).toFixed(1);
    else if (pID === "798")
      input.value = (getValueByPid("768") - getValueByPid("220")).toFixed(2);
    else if (pID === "474")
      input.value = ((getValueByPid("629") / 13.5) * 1.1).toFixed(2);
  }

  // Final Formatting
  let val = input.value.trim().replace(/[HLhl\s,]/g, "");
  if (val !== "" && !isNaN(val)) {
    let n = parseFloat(val);
    if (rule.factor && !input.dataset.formatted) {
      n *= rule.factor;
      input.dataset.formatted = "true";
    }

    if (rule.isText) {
      input.style.cssText =
        "font-weight:bold; background:#f3e5f5; text-align:center;";
    } else {
      input.value = rule.comma
        ? Math.round(n).toLocaleString("en-IN")
        : rule.pad
          ? Math.round(n).toString().padStart(2, "0")
          : rule.decimals === 0
            ? Math.round(n).toString()
            : n.toFixed(rule.decimals);
      const c = row.querySelectorAll("td");
      const min = parseFloat(c[4]?.innerText),
        max = parseFloat(c[5]?.innerText);
      input.style.fontWeight = "bold";
      input.style.backgroundColor =
        !isNaN(min) && (n < min || n > max) ? "#ffcdd2" : "#c8e6c9";
    }
  }
}

function injectStaticHub() {
  if (document.getElementById("master-static-btn")) return;
  const fab = document.createElement("button");
  fab.id = "master-static-btn";
  fab.innerHTML = "🪄";
  fab.style.cssText =
    "position:fixed; bottom:40px; right:40px; width:60px; height:60px; border-radius:50%; border:none; background:#007bff; color:white; font-size:24px; cursor:move; z-index:1000000; box-shadow:0 4px 10px rgba(0,0,0,0.2);";

  let drag = false,
    oL = 0,
    oT = 0;
  fab.onmousedown = (e) => {
    drag = true;
    oL = e.clientX - fab.offsetLeft;
    oT = e.clientY - fab.offsetTop;
  };
  document.onmousemove = (e) => {
    if (drag) {
      fab.style.left = e.clientX - oL + "px";
      fab.style.top = e.clientY - oT + "px";
      fab.style.bottom = "auto";
      fab.style.right = "auto";
    }
  };
  document.onmouseup = () => {
    drag = false;
  };
  fab.onclick = (e) => {
    if (!drag) {
      document.querySelectorAll("input._Result").forEach(formatInputByRow);
      setTimeout(
        () =>
          document.querySelectorAll("input._Result").forEach(formatInputByRow),
        150,
      );
    }
  };
  document.body.appendChild(fab);
}

function addMagicWands() {
  document.querySelectorAll("input._Result").forEach((input) => {
    const pID = input.closest("tr")?.getAttribute("p");
    if (
      TEST_RULES[pID]?.hasTrigger &&
      !input.parentElement.querySelector(".format-btn")
    ) {
      const btn = document.createElement("button");
      btn.innerText = "🪄";
      btn.className = "format-btn";
      btn.style.cssText =
        "margin-left:8px; cursor:pointer; border-radius:4px; border:1px solid #ccc; background:#fff; font-size:10px; padding:2px 4px;";
      input.parentElement.appendChild(btn);
      btn.onclick = (e) => {
        e.preventDefault();
        formatInputByRow(input);
        setTimeout(() => {
          // FIXED: Explicitly trigger the correct p-IDs for the Viral Group (440)
          let ids =
            pID === "629"
              ? ["628", "468", "482", "474"]
              : pID === "440"
                ? ["440", "439", "438", "397", "401"]
                : [];
          ids.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            if (tr) formatInputByRow(tr.querySelector("input._Result"));
          });
        }, 50);
      };
    }
  });
}

injectStaticHub();
addMagicWands();
setInterval(addMagicWands, 2000);
