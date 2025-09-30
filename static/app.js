async function fetchRate() {
    const res = await fetch("/api/rate");
    return res.json();
}

async function fetchHistory(days) {
    const res = await fetch(`/api/history?days=${days}`);
    return res.json();
}

async function fetchStats(days) {
    const res = await fetch(`/api/stats?days=${days}`);
    return res.json();
}

async function refresh() {
    const days = document.getElementById("days-select").value;

    // Cotação atual
    const rate = await fetchRate();
    document.getElementById("current-price").textContent =
        `R$ ${rate.price.toFixed(4)}`;
    document.getElementById("last-update").textContent =
        new Date(rate.at).toLocaleString();

    // Histórico
    const history = await fetchHistory(days);
    updateChart(history);

    // Estatísticas
    const stats = await fetchStats(days);
    document.getElementById("last").textContent = stats.last?.toFixed(4) || "--";
    document.getElementById("min").textContent = stats.min?.toFixed(4) || "--";
    document.getElementById("max").textContent = stats.max?.toFixed(4) || "--";
    document.getElementById("mean").textContent = stats.mean?.toFixed(4) || "--";
    document.getElementById("mm7").textContent = stats.mm7?.toFixed(4) || "--";
    document.getElementById("variation").textContent =
        stats.variation?.toFixed(4) || "--";
}

// Gráfico
let chart;
function updateChart(data) {
    const ctx = document.getElementById("history-chart").getContext("2d");
    const labels = data.map(d => new Date(d.t).toLocaleDateString());
    const values = data.map(d => d.v);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "USD/BRL",
                data: values,
                borderColor: "#14ffec",
                backgroundColor: "rgba(20, 255, 236, 0.2)",
                tension: 0.3,
                fill: true
            }]
        }
    });
}

// Eventos
document.getElementById("refresh").addEventListener("click", refresh);
document.getElementById("days-select").addEventListener("change", refresh);

// Inicializa
refresh();
