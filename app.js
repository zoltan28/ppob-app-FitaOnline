const API = "https://YOUR-BACKEND.onrender.com";

async function order(sku){
  let target = document.getElementById("target").value;

  let res = await fetch(API+"/order",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({
      buyer_sku_code: sku,
      customer_no: target,
      ref_id: "INV"+Date.now()
    })
  });

  let data = await res.json();
  alert(data.data.message);
}
