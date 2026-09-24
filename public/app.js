const $ = id => document.getElementById(id);
const fields = ["sheepCount","birthsPerHead","salePrice","feed","utilities","other"];

function num(id){ return Math.max(0, Number($(id).value) || 0); }
function money(value){
  return new Intl.NumberFormat("ar-PS",{style:"currency",currency:"ILS",maximumFractionDigits:0}).format(value);
}

function calculate(){
  const count = num("sheepCount");
  const birthsPerHead = num("birthsPerHead");
  const salePrice = num("salePrice");

  const costPerHead = ["feed","utilities","other"].reduce(
    (sum,id) => sum + num(id), 0
  );

  const birthCount = count * birthsPerHead;
  const revenue = birthCount * salePrice;
  const annualExpenses = count * costPerHead;
  const profit = revenue - annualExpenses;
  const profitPerBirth = birthCount > 0 ? profit / birthCount : 0;

  $("headCount").textContent = count.toLocaleString("ar-PS");
  $("birthCount").textContent = birthCount.toLocaleString("ar-PS",{maximumFractionDigits:1});
  $("salePriceResult").textContent = money(salePrice);
  $("revenue").textContent = money(revenue);
  $("costPerSheep").textContent = money(costPerHead);
  $("annualExpenses").textContent = money(annualExpenses);
  $("profitPerSheep").textContent = money(profitPerBirth);
  $("monthlyProfit").textContent = money(profit / 12);
  $("netProfit").textContent = money(profit);

  const badge = $("statusBadge");
  if(profit > 0){
    badge.textContent = "ربح";
    badge.style.color = "var(--accent)";
    $("profitNote").textContent = "مبيعات المواليد ناقص مصاريف السنة";
  } else if(profit < 0){
    badge.textContent = "خسارة";
    badge.style.color = "var(--danger)";
    $("profitNote").textContent = "مصاريف السنة أعلى من مبيعات المواليد";
  } else {
    badge.textContent = "تعادل";
    badge.style.color = "var(--accent-2)";
    $("profitNote").textContent = "المبيعات تساوي مصاريف السنة";
  }
}

$("calculatorForm").addEventListener("submit", e => {
  e.preventDefault();
  calculate();
});

fields.forEach(id => $(id).addEventListener("input", calculate));

$("resetBtn").addEventListener("click", () => {
  $("calculatorForm").reset();
  calculate();
});

calculate();
