// checkout.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbzFRSWxUKXpVDc4pmSFdjHG2tDyFIRawlRI6VHA5kjkqS0x5vdvjXZXLlBW75nG9U-x-w/exec";

 // Apps Script URL
document.getElementById('dt').innerText = new Date().toLocaleString();

const params = new URLSearchParams(location.search);
const invoice_id = params.get('invoice_id');
if(!invoice_id){ document.getElementById('invoiceCard').innerHTML = '<h3>Invalid invoice</h3>'; }
else loadInvoice(invoice_id);

async function api(action, body){
  const url = GAS_URL + '?action=' + action;
  if(body) {
    const r = await fetch(GAS_URL + '?action=' + action, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    return r.json();
  } else {
    const r = await fetch(url + (body? '':''));
    return r.json();
  }
}

async function loadInvoice(id){
  const resp = await fetch(GAS_URL + '?action=getInvoice&invoice_id=' + encodeURIComponent(id));
  const j = await resp.json();
  if(!j.ok) return document.getElementById('invoiceCard').innerHTML = '<h3>Invoice not found</h3>';
  const inv = j.invoice;
  const items = JSON.parse(inv.services_json || '[]');
  let html = `<div style="display:flex;gap:12px"><div style="flex:1">
    <h3>Bill to</h3><div>${inv.name || ''}<br>${inv.phone||''}<br>${inv.email||''}</div></div>
    <div style="text-align:right"><h3>Invoice</h3><div>${inv.invoice_id || id}</div><div>${inv.created_timestamp}</div></div></div>`;
  html += '<table class="table"><thead><tr><th>Service</th><th>Qty</th><th>Unit</th><th>Line</th></tr></thead><tbody>';
  items.forEach(it=>{ html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>₹ ${it.unit_price}</td><td>₹ ${it.qty*it.unit_price}</td></tr>`; });
  html += `</tbody></table><div style="text-align:right;margin-top:12px">Subtotal: ₹ ${inv.subtotal}<br>GST: ₹ ${inv.gst_amount}<br><div style="font-weight:700">Total: ₹ ${inv.total_amount}</div></div>`;
  html += `<div style="text-align:center;margin-top:12px"><button class="btn btn-primary" id="payBtn">Proceed to Secure Payment</button></div>`;
  document.getElementById('invoiceCard').innerHTML = html;
  document.getElementById('payBtn').onclick = ()=> startPayment(inv.invoice_id);
}

async function startPayment(invoice_id){
  // create order on server
  const res = await api('createRazorpayOrder', {invoice_id});
  if(!res.ok) return alert('Order error: ' + JSON.stringify(res));
  const order = res.order; // includes id
  const key_id = res.key_id;
  const amount = order.amount;
  const options = {
    key: key_id,
    amount: amount,
    currency: 'INR',
    name: 'InfoGrip',
    description: 'Invoice ' + invoice_id,
    order_id: order.id,
    handler: function(response){
      // confirm on server
      fetch(GAS_URL + '?action=confirmPayment', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        invoice_id: invoice_id
      })}).then(r=>r.json()).then(j=>{
        if(j.ok){
          // redirect to thank you with params
          const url = 'thankyou.html?invoice='+encodeURIComponent(invoice_id)+'&payment='+encodeURIComponent(j.payment_id)+'&amount='+encodeURIComponent(j.total_amount||'')+'&pdf='+encodeURIComponent(j.pdf_url||'')+'&phone='+encodeURIComponent(j.phone||'');
          window.location = url;
        } else alert('Verification failed: ' + JSON.stringify(j));
      });
    },
    prefill: { name: '', email: '', contact: '' }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
