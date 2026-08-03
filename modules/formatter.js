(function (global) {
  const { TEST_RULES } = global.AutoFormatter?.rules || {};

  function getValueByPid(id) {
    const row = document.querySelector(`tr[p="${id}"]`);
    const input = row?.querySelector("input._Result");
    const raw = input ? input.value.replace(/[^\d.\-*]/g, "") : "";
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
      const input = document.querySelector(`tr[p="${item.id}"] input._Result`);
      if (input) {
        input.value = item.val.toString().padStart(2, "0");
        applyRowStyle(input, input.closest("tr"), item.val);
      }
    });
  }

  function applyRowStyle(input, row, n) {
    const pID = row?.getAttribute("p");
    if (TEST_RULES[pID]?.isText) {
      input.style.cssText =
        "font-weight:bold; background:#f3e5f5; text-align:center;";
    } else {
      const columns = row?.querySelectorAll("td");
      const min = parseFloat(columns?.[4]?.innerText),
        max = parseFloat(columns?.[5]?.innerText);
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

    let value = input.value.trim().replace(/[HLhl\s,]/g, "");
    if (value !== "" && !isNaN(value)) {
      let n = parseFloat(value);
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

  global.AutoFormatter = global.AutoFormatter || {};
  global.AutoFormatter.formatter = {
    getValueByPid,
    balanceDLC,
    applyRowStyle,
    formatInputByRow,
  };
})(window);
