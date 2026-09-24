const $ = id => document.getElementById(id);
const fields = ["sheepCount","purchasePrice","salePrice","mortality","feed","medicine","vaccines","utilities","labor","other"];

function num(id){ return Math.max(0, Number($(id).value) || 0); }
function money(value){
  return new Intl.NumberFormat("ar-PS",{style:"currency",currency:"ILS",maximumFractionDigits:0}).format(value);
}
function calculate(){
  const count=num("sheepCount");
  const purchase=num("purchasePrice");
  const sale=num("salePrice");
  const mortality=Math.min(100,num("mortality"));
  const annualPerHead=["feed","medicine","vaccines","utilities","labor","other"].reduce((s,id)=>s+num(id),0);
  const purchaseTotal=count*purchase;
  const annualExpenses=count*annualPerHead;
  const sold=count*(1-mortality/100);
  const revenue=sold*sale;
  const totalCost=purchaseTotal+annualExpenses;
  const profit=revenue-totalCost;
  const costPerHead=purchase+annualPerHead;
  const profitPerSold=sold>0 ? revenue/sold-costPerHead/(1-mortality/100) : 0;
  const profitPercent=totalCost>0 ? profit/totalCost*100 : 0;

  $("investment").textContent=money(purchaseTotal);
  $("annualExpenses").textContent=money(annualExpenses);
  $("revenue").textContent=money(revenue);
  $("soldCount").textContent=sold.toLocaleString("ar-PS",{maximumFractionDigits:1});
  $("costPerSheep").textContent=money(costPerHead);
  $("profitPerSheep").textContent=money(profitPerSold);
  $("profitPercent").textContent=profitPercent.toFixed(1)+"%";
  $("monthlyProfit").textContent=money(profit/12);
  $("netProfit").textContent=money(profit);

  const badge=$("statusBadge");
  if(profit>0){badge.textContent="ربح";badge.style.color="var(--accent)";$("profitNote").textContent="النتيجة موجبة بعد خصم جميع التكاليف المدخلة";}
  else if(profit<0){badge.textContent="خسارة";badge.style.color="var(--danger)";$("profitNote").textContent="التكاليف المدخلة أعلى من قيمة المبيعات";}
  else{badge.textContent="تعادل";badge.style.color="var(--accent-2)";$("profitNote").textContent="لا يوجد ربح أو خسارة وفق الأرقام المدخلة";}
}
$("calculatorForm").addEventListener("submit",e=>{e.preventDefault();calculate()});
fields.forEach(id=>$(id).addEventListener("input",calculate));
$("resetBtn").addEventListener("click",()=>{
  $("calculatorForm").reset();
  calculate();
});
calculate();
