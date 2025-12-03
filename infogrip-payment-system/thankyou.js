const p = new URLSearchParams(location.search);
const inv = p.get('invoice'); const pay = p.get('payment'); const amt = p.get('amount'); const pdf = p.get('pdf'); const phone = p.get('phone');
document.getElementById('inv').innerText = inv || '—';
document.getElementById('pid').innerText = pay || '—';
document.getElementById('amt').innerText = amt || '—';
document.getElementById('pdfLink').href = pdf || '#';
document.getElementById('waLink').href = 'https://wa.me/' + (phone||'') + '?text=' + encodeURIComponent('Hi, I have completed payment. Invoice: ' + (inv||''));
