const $ = id => document.getElementById(id);
const fields = ["sheepCount","birthsPerHead","salePrice","mortality","feed","medicine","vaccines","utilities","labor","other"];

function num(id){ return Math.max(0, Number($(id).value) || 0); }
function money(value){
  return new Intl.NumberFormat("ar-PS",{style:"currency",currency:"ILS",maximumFractionDigits:0}).format(value);
}

function calculate(){
  const count = num("sheepCount");
  const birthsPerHead = num("birthsPerHead");
  const salePrice = num("salePrice");
  const mortality = Math.min(100,num("mortality"));

  const annualPerHead = ["feed","medicine","vaccines","utilities","labor","other"]
    .reduce((sum,id) => sum + num(id), 0);

  const birthCount = count * birthsPerHead;
  const soldCount = birthCount * (1 - mortality / 100);
  const revenue = soldCount * salePrice;
  const annualExpenses = count * annualPerHead;
  const profit = revenue - annualExpenses;

  const profitPerSold = soldCount > 0 ? profit / soldCount : 0;
  const profitPercent = annualExpenses > 0 ? profit / annualExpenses * 100 : 0;

  $("annualExpenses").textContent = money(annualExpenses);
  $("birthCount").textContent = birthCount.toLocaleString("ar-PS",{maximumFractionDigits:1});
  $("soldCount").textContent = soldCount.toLocaleString("ar-PS",{maximumFractionDigits:1});
  $("revenue").textContent = money(revenue);
  $("costPerSheep").textContent = money(annualPerHead);
  $("profitPerSheep").textContent = money(profitPerSold);
  $("profitPercent").textContent = profitPercent.toFixed(1) + "%";
  $("monthlyProfit").textContent = money(profit / 12);
  $("netProfit").textContent = money(profit);

  const badge = $("statusBadge");
  if(profit > 0){
    badge.textContent = "ربح";
    badge.style.color = "var(--accent)";
    $("profitNote").textContent = "المبيعات ناقص مصاريف تربية القطيع";
  } else if(profit < 0){
    badge.textContent = "خسارة";
    badge.style.color = "var(--danger)";
    $("profitNote").textContent = "مصاريف التربية أعلى من مبيعات المواليد";
  } else {
    badge.textContent = "تعادل";
    badge.style.color = "var(--accent-2)";
    $("profitNote").textContent = "المبيعات تساوي مصاريف التربية";
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
