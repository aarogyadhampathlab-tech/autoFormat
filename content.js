/** @format */

const TEST_RULES = {
  // --- URINE / BLOOD EXAM DEFAULTS ---
  642: { value: "20", hasTrigger: true }, // QUANTITY (The Trigger)
  210: { value: "PALE YELLOW", isText: true }, // COLOUR
  784: { value: "CLEAR", isText: true }, // TRANSPARENCY
  705: { value: "1.020", decimals: 3 }, // SPECIFIC GRAVITY
  593: { value: "6.0", decimals: 1 }, // PH
  619: { value: "NIL", isText: true }, // Protein Albumin
  729: { value: "NIL", isText: true }, // SUGAR
  127: { value: "NIL", isText: true }, // BLOOD
  122: { value: "NIL", isText: true }, // BILIRUBIN
  836: { value: "NIL", isText: true }, // UROBILINOGEN
  490: { value: "NIL", isText: true }, // KETONE BODIES

  646: { value: "NIL", isText: true }, // RBC
  238: { value: "NIL", isText: true }, // CRYSTALS
  175: { value: "NIL", isText: true }, // CASTS
  571: { value: "NIL", isText: true }, // OTHERS

  // --- YOUR PREVIOUS SETTINGS ---
  390: { decimals: 1 },
  773: { decimals: 0, comma: true, factor: 1000 },
  643: { decimals: 2 },
  597: { decimals: 2, factor: 0.01 },
  573: { decimals: 1 },
  559: { decimals: 0, isDLC: true },
  516: { decimals: 0, pad: true, isDLC: true },
  544: { decimals: 0, pad: true, isDLC: true },
  293: { decimals: 0, pad: true, isCalculated: true, isDLC: true },
  108: { ignore: true },
  276: { ignore: true },
  137: { decimals: 0, hasTrigger: true }, //UREA
  138: { decimals: 1, isCalculated: true },
  680: { decimals: 2 },
  768: { decimals: 2 },
  220: { decimals: 2, isCalculated: true },
  798: { decimals: 2, isCalculated: true },
  629: { decimals: 1, hasTrigger: true },
  628: { decimals: 1, isCalculated: true },
  482: { decimals: 1, isCalculated: true },
  468: { ignore: true },
  474: { decimals: 2, isCalculated: true },
  440: { name: "HIV MAIN", isText: true, hasTrigger: true },
  439: { name: "HIV I", isText: true, value: "NON REACTIVE" },
  438: { name: "HIV II", isText: true, value: "NON REACTIVE" },
  397: { name: "HBsAg", isText: true, value: "NON REACTIVE" },
  401: { name: "HCV", isText: true, value: "NON REACTIVE" },
};

/* -------------------------------- CELEBRATION -------------------------------- */
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

  // Inject animation keyframes if not already present
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
/* ---------------------------------- URINE --------------------------------- */
function addManualTriggers() {
  document.querySelectorAll("input._Result").forEach((input) => {
    const pID = input.closest("tr")?.getAttribute("p");
    const rule = TEST_RULES[pID];

    // Only add button if rule is manual and button doesn't exist yet
    if (
      rule?.isManual &&
      !input.parentElement.querySelector(".manual-fill-btn")
    ) {
      const btn = document.createElement("button");
      btn.innerText = "🔥";
      btn.className = "manual-fill-btn";
      btn.style.cssText =
        "margin-left:8px; cursor:pointer; border-radius:4px; border:1px solid #ccc; background:#fff3e0; font-size:10px; padding:2px 4px;";

      input.parentElement.appendChild(btn);

      btn.onclick = (e) => {
        e.preventDefault();

        // --- NEW ONE-CLICK FILL LOGIC ---
        if (pID === "642") {
          const urineIds = [
            "642",
            "210",
            "784",
            "705",
            "593",
            "619",
            "729",
            "127",
            "122",
            "836",
            "490",
            "294",
            "632",
            "646",
            "238",
            "175",
            "571",
            "190",
          ];
          urineIds.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            const inp = tr?.querySelector("input._Result");
            if (inp && TEST_RULES[id]?.value) {
              inp.value = TEST_RULES[id].value;
            }
          });
        }

        formatInputByRow(input);

        setTimeout(() => {
          let ids =
            pID === "629"
              ? ["628", "468", "482", "474"]
              : pID === "440"
                ? ["440", "439", "438", "397", "401"]
                : pID === "642"
                  ? [
                      "642",
                      "210",
                      "784",
                      "705",
                      "593",
                      "619",
                      "729",
                      "127",
                      "122",
                      "836",
                      "490",
                      "294",
                      "632",
                      "646",
                      "238",
                      "175",
                      "571",
                      "190",
                    ]
                  : [];
          ids.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            if (tr) formatInputByRow(tr.querySelector("input._Result"));
          });
        }, 50);
        celebrationEffect();
      };
    }
  });
}
/* ---------------------------------- URINE --------------------------------- */

function getValueByPid(id) {
  const r = document.querySelector(`tr[p="${id}"]`);
  const i = r?.querySelector("input._Result");
  const raw = i ? i.value.replace(/[^\d.\-*]/g, "") : "";
  return raw === "" ? 0 : parseFloat(raw);
}

function balanceDLC() {
  let n = getValueByPid("559"),
    l = getValueByPid("516"),
    m = getValueByPid("544");
  let nF = Math.floor(n),
    lF = Math.floor(l),
    mF = Math.floor(m);
  let eRaw = 100 - (n + l + m);
  let eF = Math.floor(eRaw);

  let items = [
    { id: "559", val: nF, rem: n - nF },
    { id: "516", val: lF, rem: l - lF },
    { id: "544", val: mF, rem: m - mF },
    { id: "293", val: eF, rem: eRaw - eF },
  ];

  let gap = 100 - (nF + lF + mF + eF);
  items.sort((a, b) => b.rem - a.rem);
  for (let i = 0; i < gap; i++) items[i].val += 1;

  let eos = items.find((x) => x.id === "293");
  let mon = items.find((x) => x.id === "544");
  if (eos.val <= 0) {
    eos.val = 1;
    mon.val = Math.max(0, mon.val - 1);
  }

  items.forEach((item) => {
    const inp = document.querySelector(`tr[p="${item.id}"] input._Result`);
    if (inp) {
      inp.value = item.val.toString().padStart(2, "0");
      applyRowStyle(inp, inp.closest("tr"), item.val);
    }
  });
}

function applyRowStyle(input, row, n) {
  const pID = row.getAttribute("p");
  if (TEST_RULES[pID]?.isText) {
    input.style.cssText =
      "font-weight:bold; background:#f3e5f5; text-align:center;";
  } else {
    const c = row.querySelectorAll("td");
    const min = parseFloat(c[4]?.innerText),
      max = parseFloat(c[5]?.innerText);
    input.style.fontWeight = "bold";
    input.style.backgroundColor =
      !isNaN(min) && (n < min || n > max) ? "#ffcdd2" : "#c8e6c9";
  }
}

function formatInputByRow(input) {
  const row = input.closest("tr");
  const pID = row?.getAttribute("p");
  if (pID === "108") {
    input.value = "00";
    return applyRowStyle(input, row, 0);
  }

  const rule = TEST_RULES[pID];
  if (!rule || rule.ignore) return;
  if (rule.isDLC) return balanceDLC();

  if (pID === "628") input.value = "13.5";
  if (pID === "482") input.value = "1.1";
  if (rule.isText && rule.value) input.value = rule.value;

  if (rule.isCalculated) {
    if (pID === "220" && getValueByPid("220") === 0) input.value = "0.20";
    else if (pID === "138")
      input.value = (getValueByPid("137") / 2.14).toFixed(1);
    else if (pID === "798")
      input.value = (getValueByPid("768") - getValueByPid("220")).toFixed(2);
    else if (pID === "474")
      input.value = ((getValueByPid("629") / 13.5) * 1.1).toFixed(2);
  }

  let val = input.value.trim().replace(/[HLhl\s,]/g, "");
  if (val !== "" && !isNaN(val)) {
    let n = parseFloat(val);
    if (rule.factor && !input.dataset.formatted) {
      n *= rule.factor;
      input.dataset.formatted = "true";
    }
    input.value = rule.comma
      ? Math.round(n).toLocaleString("en-IN")
      : rule.pad
        ? Math.round(n).toString().padStart(2, "0")
        : rule.decimals === 0
          ? Math.round(n).toString()
          : n.toFixed(rule.decimals);
    applyRowStyle(input, row, n);
  }
}

function addMagicWands() {
  document.querySelectorAll("input._Result").forEach((input) => {
    const pID = input.closest("tr")?.getAttribute("p");

    // Ensure we only add the button to the trigger IDs defined in TEST_RULES
    if (
      TEST_RULES[pID]?.hasTrigger &&
      !input.parentElement.querySelector(".format-btn")
    ) {
      const btn = document.createElement("button");
      btn.innerText = "🔥";
      btn.className = "format-btn";
      btn.style.cssText =
        "margin-left:8px; cursor:pointer; border-radius:4px; border:1px solid #ccc; background:#fff; font-size:10px; padding:2px 4px;";
      input.parentElement.appendChild(btn);

      btn.onclick = (e) => {
        e.preventDefault();

        // 1. Bulk Fill Logic for Quantity
        if (pID === "642") {
          const urineIds = [
            "642",
            "210",
            "784",
            "705",
            "593",
            "619",
            "729",
            "127",
            "122",
            "836",
            "490",
            "294",
            "632",
            "646",
            "238",
            "175",
            "571",
            "190",
          ];
          urineIds.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            const inp = tr?.querySelector("input._Result");
            if (inp && TEST_RULES[id]?.value) {
              inp.value = TEST_RULES[id].value;
              // Remove formatted flag to ensure decimal logic runs correctly
              delete inp.dataset.formatted;
            }
          });
        }

        // 2. Format the clicked row
        formatInputByRow(input);

        // 3. Refresh linked rows
        setTimeout(() => {
          let ids = [];
          if (pID === "137")
            ids = ["138"]; // Urea updates BUN
          else if (pID === "629") ids = ["628", "468", "482", "474"];
          else if (pID === "440") ids = ["440", "439", "438", "397", "401"];
          else if (pID === "642")
            ids = [
              "642",
              "210",
              "784",
              "705",
              "593",
              "619",
              "729",
              "127",
              "122",
              "836",
              "490",
              "294",
              "632",
              "646",
              "238",
              "175",
              "571",
              "190",
            ];

          ids.forEach((id) => {
            const tr = document.querySelector(`tr[p="${id}"]`);
            const targetInput = tr?.querySelector("input._Result");
            if (targetInput) formatInputByRow(targetInput);
          });
          celebrationEffect();
        }, 50);
      };
    }
  });
}

function injectStaticHub() {
  if (document.getElementById("master-static-btn")) return;

  // Inject CSS for hover and click animations
  const style = document.createElement("style");
  style.textContent = `
    #master-static-btn {
      transition: all 0.3s ease;
    }
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

  // Change icon on hover
  fab.addEventListener("mouseenter", () => {
    fab.innerHTML = "🙄";
  });
  fab.addEventListener("mouseleave", () => {
    fab.innerHTML = "😴";
  });

  // Change icon on click
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

injectStaticHub();
addMagicWands();
setInterval(addMagicWands, 250);
/* ---------------------------------- URINE --------------------------------- */
addManualTriggers();
setInterval(addManualTriggers, 250);
/* ---------------------------------- URINE --------------------------------- */
