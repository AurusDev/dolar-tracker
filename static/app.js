let chart;

function fmt(v) { return v != null ? "R$ " + v.toFixed(4) : "—"; }
function pct(v) { return v != null ? v.toFixed(2) + "%" : "—"; }
function timefmt(iso) { try { return new Date(iso).toLocaleString(); } catch { return "—"; } }

async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
}

async function refreshNow(showToast = false) {
    const r = await fetch("/api/refresh", { method: "POST" });
    if (!r.ok) return;
    const data = await r.json();
    document.getElementById("priceNow").textContent = fmt(data.price);
    // atualiza timestamp atual via /api/rate
    const rate = await getJSON("/api/rate");
    document.getElementById("priceTime").textContent = timefmt(rate.at);
    if (showToast) toast("Atualizado!");
    await reloadSeries();
}

async function loadNow() {
    const rate = await getJSON("/api/rate");
    document.getElementById("priceNow").textContent = fmt(rate.price);
    document.getElementById("priceTime").textContent = timefmt(rate.at);
}

async function reloadSeries() {
    const range = document.getElementById("rangeSelect").value;
    const series = await getJSON(`/api/history?days=${range}`);
    const stats = await getJSON(`/api/stats?days=${range}`);

    // gráfico
    const labels = series.map(p => new Date(p.t));
    const values = series.map(p => p.v);

    const ctx = document.getElementById("historyChart").getContext("2d");
    if (chart) { chart.destroy(); }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'USD/BRL', data: values, tension: .25, pointRadius: 0 },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'time', time: { unit: 'day' } },
                y: { beginAtZero: false }
            },
            plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });

    // stats
    document.getElementById("st_last").textContent = fmt(stats.last);
    document.getElementById("st_min").textContent = fmt(stats.min);
    document.getElementById("st_max").textContent = fmt(stats.max);
    document.getElementById("st_mean").textContent = fmt(stats.mean);
    document.getElementById("st_ma7").textContent = fmt(stats.ma7);
    document.getElementById("st_change").textContent = stats.change_pct != null ? pct(stats.change_pct) : "—";
}

function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
}

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("refreshBtn").addEventListener("click", () => refreshNow(true));
    document.getElementById("rangeSelect").addEventListener("change", reloadSeries);

    await loadNow();
    await reloadSeries();
});
