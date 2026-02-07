/** @format */

const TEST_RULES = {
  // CBC PANEL
  390: { name: "HB", decimals: 1, color: "#ffebee" },
  773: {
    name: "TLC",
    decimals: 0,
    comma: true,
    factor: 1000,
    color: "#e8f5e9",
  },
  643: { name: "RBC", decimals: 2, color: "#e3f2fd" },
  597: { name: "PLATELETS", decimals: 2, factor: 0.01, color: "#fff3e0" },
  573: { name: "PCV", decimals: 1, color: "#f1f8e9" },
  520: { name: "MCV", decimals: 1 },
  518: { name: "MCH", decimals: 1 },
  519: { name: "MCHC", decimals: 1 },
  559: { name: "NEUTROPHIL", decimals: 0 },
  516: { name: "LYMPHOCYTE", decimals: 0, pad: true },
  293: { name: "EOSINOPHIL", decimals: 0, pad: true, isCalculated: true },
  544: { name: "MONOCYTE", decimals: 0, pad: true },
  108: { name: "BASOPHIL", decimals: 0, pad: true },
  276: { name: "DLC TOTAL", ignore: true },

  // KFT / LFT / PT
  137: { name: "UREA", decimals: 0 },
  138: { name: "BUN", decimals: 1, isCalculated: true, hasTrigger: true },
  680: { name: "CREATININE", decimals: 2 },
  768: { name: "TOTAL BILIRUBIN", decimals: 2 },
  220: { name: "DIRECT BILIRUBIN", decimals: 2, isCalculated: true },
  798: { name: "INDIRECT BILIRUBIN", decimals: 2, isCalculated: true },

  // PT / INR / VIRAL
  629: { name: "PT PATIENT", decimals: 1, hasTrigger: true },
  628: { name: "PT CONTROL", decimals: 1, isCalculated: true },
  482: { name: "ISI", decimals: 1, isCalculated: true },
  468: { name: "INDEX", ignore: true },
  474: { name: "INR", decimals: 2, isCalculated: true },
  440: { name: "HIV MAIN", isText: true, hasTrigger: true },
  439: { name: "HIV I", isText: true, value: "NON REACTIVE" },
  438: { name: "HIV II", isText: true, value: "NON REACTIVE" },
  397: { name: "HBsAg", isText: true, value: "NON REACTIVE" },
  401: { name: "HCV", isText: true, value: "NON REACTIVE" },
};

// Helper: Gets raw numeric value (preserves decimals for internal math)
function getRawValue(pID) {
  const row = document.querySelector(`tr[p="${pID}"]`);
  if (!row) return 0;
  const input = row.querySelector("input._Result");
  let val =
    input && input.value ? input.value.trim().replace(/[^\d.-]/g, "") : "0";
  return val === "" ? 0 : parseFloat(val);
}

function formatInputByRow(input) {
  const row = input.closest("tr");
  if (!row) return;
  const pID = row.getAttribute("p");
  const rule = TEST_RULES[pID];
  if (!rule || rule.ignore) return;

  if (pID === "108") input.value = "00";

  // --- CALCULATIONS ---
  if (rule.isCalculated || pID === "220") {
    if (pID === "220") {
      // Direct Bili logic
      if (getRawValue("220") === 0) input.value = "0.20";
    } else if (pID === "293") {
      // DLC Balance Logic
      // Step 1: Round the other inputs first to see what they will look like on screen
      const n = Math.round(getRawValue("559"));
      const l = Math.round(getRawValue("516"));
      const m = Math.round(getRawValue("544"));
      const b = 0; // Basophil forced to 0

      // Step 2: Calculate balance based on those rounded integers
      let balance = 100 - (n + l + m + b);
      if (balance < 1) balance = 1; // Minimum 01
      input.value = balance.toString().padStart(2, "0");
    } else if (pID === "138")
      input.value = (getRawValue("137") / 2.14).toFixed(1);
    else if (pID === "798")
      input.value = (getRawValue("768") - getRawValue("220")).toFixed(2);
    else if (pID === "474")
      input.value = ((getRawValue("629") / 13.5) * 1.1).toFixed(2);
  }

  // --- FORMATTING ---
  let cleanValue = input.value.trim().replace(/[HLhl\s,]/g, "");
  if (cleanValue !== "" && !isNaN(cleanValue)) {
    let num = parseFloat(cleanValue);
    if (rule.factor && !input.dataset.formatted) {
      num = num * rule.factor;
      input.dataset.formatted = "true";
    }

    if (rule.isText) {
      if (rule.value) input.value = rule.value;
      input.style.fontWeight = "bold";
      input.style.backgroundColor = "#f3e5f5";
      input.style.textAlign = "center";
      return;
    }

    // Apply strict rounding/formatting
    if (rule.comma) input.value = Math.round(num).toLocaleString("en-IN");
    else if (rule.pad)
      input.value = Math.round(num).toString().padStart(2, "0");
    else if (rule.decimals === 0) input.value = Math.round(num).toString();
    else input.value = num.toFixed(rule.decimals);

    input.style.fontWeight = "bold";

    // Range Highlight using table columns 4 and 5
    const cells = row.querySelectorAll("td");
    const minVal = parseFloat(cells[4]?.innerText);
    const maxVal = parseFloat(cells[5]?.innerText);

    if (!isNaN(minVal) && !isNaN(maxVal)) {
      input.style.backgroundColor =
        num < minVal || num > maxVal ? "#ffcdd2" : "#c8e6c9";
      input.style.color = num < minVal || num > maxVal ? "#b71c1c" : "#1b5e20";
    } else {
      input.style.backgroundColor = rule.color || "#e8f5e9";
    }
  }
}

// Master UI
function injectStaticHub() {
  if (document.getElementById("master-static-btn")) return;
  const fab = document.createElement("button");
  fab.id = "master-static-btn";
  fab.innerHTML = "🪄";
  fab.style.cssText =
    "position:fixed; bottom:40px; right:40px; width:60px; height:60px; border-radius:50%; border:none; background:#007bff; color:white; font-size:24px; cursor:move; z-index:1000000; box-shadow:0 4px 10px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center;";

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
    if (drag) return;
    document.querySelectorAll("input._Result").forEach(formatInputByRow);
    setTimeout(
      () =>
        document.querySelectorAll("input._Result").forEach(formatInputByRow),
      150,
    );
  };
  document.body.appendChild(fab);
}

function addMagicWands() {
  document.querySelectorAll("input._Result").forEach((input) => {
    const row = input.closest("tr");
    if (!row) return;
    const pID = row.getAttribute("p");
    const rule = TEST_RULES[pID];
    if (
      rule &&
      rule.hasTrigger &&
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
          let ids =
            pID === "629"
              ? ["629", "628", "482", "468", "474"]
              : pID === "440"
                ? ["440", "439", "438", "397", "401"]
                : pID === "138"
                  ? ["138"]
                  : [];
          ids.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            if (tr) formatInputByRow(tr.querySelector("input._Result"));
          });
        }, 100);
      };
    }
  });
}

injectStaticHub();
addMagicWands();
setInterval(addMagicWands, 2000);
