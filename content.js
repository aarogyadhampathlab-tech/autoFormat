/** @format */

const TEST_RULES = {
  390: { decimals: 1 },
  773: { decimals: 0, comma: true, factor: 1000 },
  643: { decimals: 2 },
  597: { decimals: 2, factor: 0.01 },
  573: { decimals: 1 },
  // DLC GROUP
  559: { decimals: 0, isDLC: true },
  516: { decimals: 0, pad: true, isDLC: true },
  544: { decimals: 0, pad: true, isDLC: true },
  293: { decimals: 0, pad: true, isCalculated: true, isDLC: true },
  108: { ignore: true }, // Basophil (Fixed 00)

  276: { ignore: true },
  137: { decimals: 0 },
  138: { decimals: 1, isCalculated: true, hasTrigger: true }, // BUN
  680: { decimals: 2 },
  768: { decimals: 2 },
  220: { decimals: 2, isCalculated: true },
  798: { decimals: 2, isCalculated: true },
  629: { decimals: 1, hasTrigger: true }, // PT Trigger
  628: { decimals: 1, isCalculated: true },
  482: { decimals: 1, isCalculated: true },
  468: { ignore: true },
  474: { decimals: 2, isCalculated: true },

  // --- VIRAL MARKERS ---
  440: { name: "HIV MAIN", isText: true, hasTrigger: true },
  439: { name: "HIV I", isText: true, value: "NON REACTIVE" },
  438: { name: "HIV II", isText: true, value: "NON REACTIVE" },
  397: { name: "HBsAg", isText: true, value: "NON REACTIVE" },
  401: { name: "HCV", isText: true, value: "NON REACTIVE" },
};

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

function injectStaticHub() {
  if (document.getElementById("master-static-btn")) return;
  const fab = document.createElement("button");
  fab.id = "master-static-btn";
  fab.innerHTML = "🪄";
  fab.style.cssText =
    "position:fixed; bottom:40px; right:40px; width:60px; height:60px; border-radius:50%; border:none; background:#007bff; color:white; font-size:24px; cursor:pointer; z-index:1000000; box-shadow:0 4px 10px rgba(0,0,0,0.2);";
  fab.onclick = () => {
    document.querySelectorAll("input._Result").forEach(formatInputByRow);
    balanceDLC();
  };
  document.body.appendChild(fab);
}

injectStaticHub();
addMagicWands();
setInterval(addMagicWands, 2000);
