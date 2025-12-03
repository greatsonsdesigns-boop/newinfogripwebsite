// admin.js
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzfKOzjLgbJx3mb0gg6rMjLnqHXBu7Xy-F1Kz5mR1jmxyeniie--FrEDjDRT3sYmXLDPQ/exec'; // e.g. https://script.google.com/macros/s/XXXX/exec
let token = null;
async function api(action, body){
  const url = GAS_URL + '?action=' + action;
  if(body){
    const resp = await fetch(GAS_URL + '?action=' + action, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    return resp.json();
  } else {
    const r = await fetch(url);
    return r.json();
  }
}
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
  document.getElementById(id).style.display='block';
}
async function adminLogin(){
  const pass = document.getElementById('adminPass').value;
  const res = await fetch(GAS_URL + '?action=login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password:pass})});
  const j = await res.json();
  if(j.ok){ token = j.token; alert('Logged in'); loadClients(); } else alert('Login failed');
}

async function loadClients(){
  const j = await api('getClients');
  const sel = document.getElementById('clientSelect');
  sel.innerHTML = '<option value="">-- New client --</option>';
  document.getElementById('clientsList').innerHTML = '';
  if(j.clients){
    j.clients.forEach(c=>{
      sel.innerHTML += `<option value="${c.client_id}">${c.name} — ${c.phone||''}</option>`;
    });
    document.getElementById('clientsList').innerHTML = '<table style="width:100%"><thead><th>Name</th><th>Phone</th><th>Email</th></thead><tbody>' + j.clients.map(c=>`<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td></tr>`).join('') + '</tbody></table>';
  }
}
let srvCount = 0;
function addServiceRow(pref){
  if(srvCount >= 5) return alert('Max 5 rows');
  srvCount++;
  const wrap = document.getElementById('servicesWrap');
  const idx = srvCount;
  const html = `<div id="row${idx}" style="display:flex;gap:8px;margin-top:8px">
    <input class="input srvName" placeholder="Service name" style="flex:1" value="${pref?pref.name:''}">
    <input class="input qty" style="width:80px" value="${pref?pref.qty:1}">
    <input class="input unit" style="width:100px" value="${pref?pref.unit_price:0}">
    <div style="width:90px">₹ <span class="line">0</span></div>
    <button onclick="removeRow(${idx})" class="btn">Remove</button>
  </div>`;
  wrap.insertAdjacentHTML('beforeend', html);
  recalc();
  document.querySelectorAll(`#row${idx} .qty, #row${idx} .unit`).forEach(inp => inp.addEventListener('input', recalc));
}
function removeRow(i){ const el = document.getElementById('row'+i); if(el){ el.remove(); srvCount--; recalc(); } }
function recalc(){
  let subtotal = 0;
  document.querySelectorAll('#servicesWrap .srvName').forEach((el, i)=>{
    const row = el.parentElement;
    const qty = Number(row.querySelector('.qty').value||1);
    const unit = Number(row.querySelector('.unit').value||0);
    const line = qty*unit;
    row.querySelector('.line').innerText = line;
    subtotal += line;
  });
  document.getElementById('subtotal').innerText = subtotal;
  const gstOn = document.getElementById('gstToggle').checked;
  const gstPct = Number(document.getElementById('gstPct').value||0);
  const gstAmount = gstOn ? Math.round(subtotal * gstPct / 100) : 0;
  document.getElementById('gstAmount').innerText = gstAmount;
  const discount = Number(document.getElementById('discount').value||0);
  const total = subtotal + gstAmount - discount;
  document.getElementById('grandTotal').innerText = total;
}
document.getElementById('gstToggle').addEventListener('change', recalc);
document.getElementById('gstPct').addEventListener('input', recalc);
document.getElementById('discount').addEventListener('input', recalc);

function resetCreate(){ document.getElementById('servicesWrap').innerHTML=''; srvCount=0; recalc(); document.getElementById('cname').value=''; document.getElementById('cphone').value=''; document.getElementById('cemail').value=''; }

async function generateInvoice(){
  // gather
  const sel = document.getElementById('clientSelect').value;
  const client = {};
  if(sel){
    // load client details from list (simple)
    client.client_id = sel;
    client.name = document.getElementById('cname').value || document.querySelector(`#clientSelect option[value="${sel}"]`).text.split(' — ')[0];
    client.phone = document.getElementById('cphone').value;
    client.email = document.getElementById('cemail').value;
  } else {
    client.name = document.getElementById('cname').value;
    client.phone = document.getElementById('cphone').value;
    client.email = document.getElementById('cemail').value;
  }
  if(!client.name || !client.phone) return alert('Provide client name & phone');
  const items = [];
  document.querySelectorAll('#servicesWrap .srvName').forEach(el=>{
    const row = el.parentElement;
    items.push({name:el.value, qty: Number(row.querySelector('.qty').value||1), unit_price: Number(row.querySelector('.unit').value||0)});
  });
  if(items.length===0) return alert('Add a service');
  const body = { token, created_by:'admin', client, items, gst_percent:Number(document.getElementById('gstPct').value||0), discount:Number(document.getElementById('discount').value||0) };
  const res = await api('createInvoice', body);
  if(res.ok){
    alert('Invoice created. Checkout link: ' + res.checkout_link);
    window.open(res.checkout_link,'_blank');
    resetCreate();
  } else {
    alert('Error: ' + (res.error || JSON.stringify(res)));
  }
}

// load small initial state
window.onload = ()=> { showSection('create'); setInterval(recalc,500); };
