// -----------------------------
// InfoGrip Admin JS (LITE B)
// -----------------------------

// YOUR APPS SCRIPT DEPLOYMENT URL
const GAS_URL = "https://script.google.com/macros/s/AKfycbxDpO32h-w4EMIuB1U8yr3YSsox9Y3kiQwZxHkgQIfxwmuVM219SVVpmUaKhTGcUcx3Nw/exec";

let token = null;

// ---------------------------------------------
// UNIVERSAL API FUNCTION (fixed & fully working)
// ---------------------------------------------
async function api(action, body = null) {
    const url = `${GAS_URL}?action=${action}`;

    const options = body
        ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
          }
        : {
              method: "GET",
          };

    try {
        console.log("📡 API CALL:", action, url, body);
        const response = await fetch(url, options);
        const json = await response.json();
        console.log("✅ API RESPONSE:", json);
        return json;
    } catch (err) {
        console.error("❌ API ERROR:", err);
        return { ok: false, error: err.toString() };
    }
}

// ---------------------------------------------
// ADMIN LOGIN
// ---------------------------------------------
async function adminLogin() {
    const pass = document.getElementById("adminPass").value;

    const res = await api("login", {
        password: pass,
    });

    if (res.ok) {
        token = res.token;
        alert("Login successful!");
        loadClients();
        showSection("create");
    } else {
        alert("Wrong password ❌");
    }
}

// ---------------------------------------------
// UI NAVIGATION
// ---------------------------------------------
function showSection(id) {
    document.querySelectorAll(".section").forEach((s) => (s.style.display = "none"));
    document.getElementById(id).style.display = "block";
}

// ---------------------------------------------
// LOAD CLIENTS
// ---------------------------------------------
async function loadClients() {
    const j = await api("getClients");

    const sel = document.getElementById("clientSelect");
    const list = document.getElementById("clientsList");

    sel.innerHTML = `<option value="">-- New client --</option>`;
    list.innerHTML = "";

    if (j.clients) {
        j.clients.forEach((c) => {
            sel.innerHTML += `<option value="${c.client_id}">${c.name} — ${c.phone}</option>`;
        });

        list.innerHTML =
            `<table style="width:100%">
               <thead><tr><th>Name</th><th>Phone</th><th>Email</th></tr></thead>
               <tbody>` +
            j.clients
                .map(
                    (c) =>
                        `<tr><td>${c.name}</td>
                              <td>${c.phone}</td>
                              <td>${c.email}</td></tr>`
                )
                .join("") +
            `</tbody></table>`;
    }
}

// ---------------------------------------------
// SERVICE ROW HANDLER
// ---------------------------------------------
let srvCount = 0;

function addServiceRow() {
    if (srvCount >= 5) return alert("Maximum 5 services allowed");

    srvCount++;

    const wrap = document.getElementById("servicesWrap");
    const id = srvCount;

    const rowHTML = `
        <div id="srv${id}" style="display:flex; gap:10px; margin-top:10px;">
            <input class="input srvName" placeholder="Service name" style="flex:1;">
            <input class="input qty" type="number" value="1" style="width:70px;">
            <input class="input unit" type="number" value="0" style="width:100px;">
            <div style="width:110px; color:white;">₹ <span class="line">0</span></div>
            <button class="btn" onclick="removeRow(${id})">Remove</button>
        </div>
    `;

    wrap.insertAdjacentHTML("beforeend", rowHTML);

    // Recalculate whenever values change
    document.querySelector(`#srv${id} .qty`).addEventListener("input", recalc);
    document.querySelector(`#srv${id} .unit`).addEventListener("input", recalc);

    recalc();
}

function removeRow(id) {
    document.getElementById("srv" + id)?.remove();
    srvCount--;
    recalc();
}

// ---------------------------------------------
// CALCULATE TOTALS
// ---------------------------------------------
function recalc() {
    let subtotal = 0;

    document.querySelectorAll("#servicesWrap > div").forEach((row) => {
        const qty = Number(row.querySelector(".qty").value || 1);
        const unit = Number(row.querySelector(".unit").value || 0);
        const line = qty * unit;

        row.querySelector(".line").innerText = line;
        subtotal += line;
    });

    document.getElementById("subtotal").innerText = subtotal;

    const gstOn = document.getElementById("gstToggle").checked;
    const gstPct = Number(document.getElementById("gstPct").value || 0);
    const gstAmount = gstOn ? Math.round((subtotal * gstPct) / 100) : 0;

    document.getElementById("gstAmount").innerText = gstAmount;

    const discount = Number(document.getElementById("discount").value || 0);
    const total = subtotal + gstAmount - discount;

    document.getElementById("grandTotal").innerText = total;
}

document.getElementById("gstToggle").addEventListener("change", recalc);
document.getElementById("gstPct").addEventListener("input", recalc);
document.getElementById("discount").addEventListener("input", recalc);

// ---------------------------------------------
// RESET FORM
// ---------------------------------------------
function resetCreate() {
    document.getElementById("servicesWrap").innerHTML = "";
    srvCount = 0;
    recalc();
    document.getElementById("cname").value = "";
    document.getElementById("cphone").value = "";
    document.getElementById("cemail").value = "";
}

// ---------------------------------------------
// GENERATE INVOICE (MAIN FUNCTION)
// ---------------------------------------------
async function generateInvoice() {
    if (!token) return alert("Please login first");

    // Read client data
    const sel = document.getElementById("clientSelect").value;
    let client = {};

    if (sel) {
        client.client_id = sel;
        client.name = document.querySelector(
            `#clientSelect option[value="${sel}"]`
        ).textContent.split(" — ")[0];

        client.phone = document.getElementById("cphone").value;
        client.email = document.getElementById("cemail").value;
    } else {
        client.name = document.getElementById("cname").value;
        client.phone = document.getElementById("cphone").value;
        client.email = document.getElementById("cemail").value;
    }

    if (!client.name || !client.phone)
        return alert("Client name & phone are required");

    // Read services
    let items = [];

    document.querySelectorAll("#servicesWrap > div").forEach((row) => {
        const name = row.querySelector(".srvName").value;
        const qty = Number(row.querySelector(".qty").value);
        const unit = Number(row.querySelector(".unit").value);

        if (name) items.push({ name, qty, unit_price: unit });
    });

    if (items.length === 0) return alert("Add at least one service");

    const gst_percent = Number(document.getElementById("gstPct").value || 0);
    const discount = Number(document.getElementById("discount").value || 0);

    // Send to GAS
    const resp = await api("createInvoice", {
        token,
        created_by: "admin",
        client,
        items,
        gst_percent,
        discount,
    });

    if (!resp.ok) {
        console.error(resp);
        return alert("Error creating invoice ❌");
    }

    alert("Checkout link created!");
    window.open(resp.checkout_link, "_blank");

    resetCreate();
}

// ---------------------------------------------
// AUTO INIT
// ---------------------------------------------
window.onload = () => {
    showSection("create");
    setInterval(recalc, 400);
};
