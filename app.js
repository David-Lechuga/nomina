const EURO = new Intl.NumberFormat("es-ES", {
  style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2
});
const FIXED = {
  sueldoBase: 900.63, destino: 637.73, especifico: 1163.16,
  trienioC2: 22.44, trienioC1: 32.96, noche: 12.16,
  prorrata: 422, seguridadSocial: 6.71
};
const OVERTIME_12 = [
  { id: "extra-12-1", label: "H.E. de L-V de 07:00 a 19:00", rate: 268.80 },
  { id: "extra-12-2", label: "H.E. de S-D de 07:00 a 19:00", rate: 336.72 },
  { id: "extra-12-3", label: "H.E. de L-J de 19:00 a 07:00", rate: 314.08 },
  { id: "extra-12-4", label: "H.E. viernes de 19:00 a 07:00", rate: 349.20 },
  { id: "extra-12-5", label: "H.E. sábado de 19:00 a 07:00", rate: 349.20 },
  { id: "extra-12-6", label: "H.E. domingo de 19:00 a 07:00", rate: 331.06 }
];
const OVERTIME_8 = [
  { id: "extra-8-1", label: "H.E. de L-V de 06:00 a 14:00", rate: 179.20 },
  { id: "extra-8-2", label: "H.E. de S-D de 06:00 a 14:00", rate: 224.48 },
  { id: "extra-8-3", label: "H.E. de L-V de 14:00 a 22:00", rate: 179.20 },
  { id: "extra-8-4", label: "H.E. de S-D de 14:00 a 22:00", rate: 224.48 },
  { id: "extra-8-5", label: "H.E. de D-J de 22:00 a 06:00", rate: 224.48 },
  { id: "extra-8-6", label: "H.E. de V-S de 22:00 a 06:00", rate: 253.60 },
  { id: "extra-8-7", label: "H.E. de L-V de Playa", rate: 329.20 },
  { id: "extra-8-8", label: "H.E. de S-D de Playa", rate: 374.48 }
];
const PAY_PLAYA = [
  { id: "paga-marzo", label: "Paga de marzo", rate: 1500 },
  { id: "paga-septiembre", label: "Paga de septiembre", rate: 1500 }
];
const PAY_ADDITIONAL = [
  { id: "paga-julio", label: "Paga de julio", rate: 750 },
  { id: "paga-agosto", label: "Paga de agosto", rate: 678 },
  { id: "paga-octubre", label: "Paga de octubre", rate: 800 },
  { id: "paga-noviembre", label: "Paga de noviembre", rate: 800 }
];
const originalValues = { "trienio-c2": "0", "trienio-c1": "6", noches: "0", irpf: "19" };
const ALL_QUANTITY_ROWS = [
  { id: "trienio-c2", rate: FIXED.trienioC2 }, { id: "trienio-c1", rate: FIXED.trienioC1 },
  { id: "noches", rate: FIXED.noche }, ...OVERTIME_12, ...OVERTIME_8, ...PAY_PLAYA, ...PAY_ADDITIONAL
];
function euro(value) { return EURO.format(value); }
function makeQuantityOptions(select, selected = "0", max = 20) {
  select.replaceChildren();
  for (let n = 0; n <= max; n += 1) {
    const option = document.createElement("option");
    option.value = String(n); option.textContent = String(n); select.appendChild(option);
  }
  select.value = selected;
}
function quantityValue(id) {
  const value = Number(document.getElementById(id).value);
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}
function setMoney(id, value) { document.getElementById(id).textContent = euro(value); }
function addQuantityRow(container, row, options = {}) {
  const item = document.createElement("div");
  item.className = "pay-item quantity-row";
  const copy = document.createElement("label");
  copy.className = "item-copy"; copy.htmlFor = row.id;
  copy.innerHTML = `<span class="item-name">${row.label}</span><span class="item-note">${euro(row.rate)} por unidad</span>`;
  const controls = document.createElement("div"); controls.className = "quantity-controls";
  const select = document.createElement("select"); select.id = row.id; select.name = row.id;
  select.setAttribute("aria-label", `Cantidad: ${row.label}`);
  makeQuantityOptions(select, options.selected || "0", options.max ?? 20);
  const total = document.createElement("strong"); total.className = "quantity-total";
  total.id = `${row.id}-total`; total.textContent = euro(0);
  total.setAttribute("aria-label", `Importe total de ${row.label}`);
  controls.append(select, total); item.append(copy, controls); container.appendChild(item);
}
function renderOvertime(containerId, rows) {
  const container = document.getElementById(containerId);
  rows.forEach(row => addQuantityRow(container, row));
}
function renderPayRows(containerId, rows) {
  const container = document.getElementById(containerId);
  rows.forEach(row => addQuantityRow(container, row, { max: 1 }));
}
function calculate() {
  const c2 = FIXED.trienioC2 * quantityValue("trienio-c2");
  const c1 = FIXED.trienioC1 * quantityValue("trienio-c1");
  const nights = FIXED.noche * quantityValue("noches");
  let overtime = 0, extraPayments = 0;
  ALL_QUANTITY_ROWS.forEach(row => {
    const amount = row.rate * quantityValue(row.id);
    const totalElement = document.getElementById(`${row.id}-total`);
    if (totalElement) totalElement.textContent = euro(amount);
    if (row.id.startsWith("extra-")) overtime += amount;
    if (row.id.startsWith("paga-")) extraPayments += amount;
  });
  const gross = FIXED.sueldoBase + FIXED.destino + FIXED.especifico + c2 + c1 + nights + overtime + extraPayments;
  const ssBase = gross + FIXED.prorrata;
  const ss = ssBase * FIXED.seguridadSocial / 100;
  const irpfPercent = Math.min(100, Math.max(0, Number(document.getElementById("irpf").value) || 0));
  const irpf = gross * irpfPercent / 100;
  const net = gross - ss - irpf;
  setMoney("gross-total", gross); setMoney("ss-base", ssBase);
  setMoney("ss-deduction", ss); setMoney("irpf-deduction", irpf); setMoney("net-total", net);
}
function resetForm() {
  Object.entries(originalValues).forEach(([id, value]) => { document.getElementById(id).value = value; });
  ALL_QUANTITY_ROWS.filter(row => row.id.startsWith("extra-") || row.id.startsWith("paga-"))
    .forEach(row => { document.getElementById(row.id).value = "0"; });
  calculate();
}
function init() {
  makeQuantityOptions(document.getElementById("trienio-c2"), "0");
  makeQuantityOptions(document.getElementById("trienio-c1"), "6");
  makeQuantityOptions(document.getElementById("noches"), "0");
  renderOvertime("hours-12", OVERTIME_12); renderOvertime("hours-8", OVERTIME_8);
  renderPayRows("pay-playa", PAY_PLAYA); renderPayRows("pay-regulation", PAY_ADDITIONAL);
  document.getElementById("payroll-form").addEventListener("input", calculate);
  document.getElementById("payroll-form").addEventListener("change", calculate);
  document.getElementById("reset-button").addEventListener("click", resetForm);
  document.getElementById("print-button").addEventListener("click", () => window.print());
  calculate();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(error => console.warn("No se pudo registrar el modo sin conexión:", error)));
  }
}
document.addEventListener("DOMContentLoaded", init);
