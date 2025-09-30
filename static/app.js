async function loadData() {
    const days = document.getElementById("days-select").value;

    try {
        // Cotação atual
        const rateRes = await fetch("/api/rate");
        const rate = await rateRes.json();
        document.getElementById("current-rate").textContent =
            "R$ " + rate.price.toFixed(4);
        document.getElementById("last-updated").textContent =
            new Date(rate.at).toLocaleString();

        // Histórico
        const historyRes = await fetch(`/api/history?days=${days}`);
        const history = await historyRes.json();
        renderChart(history);

        // Estatísticas
        const statsRes = await fetch(`/api/stats?days=${days}`);
        const stats = await statsRes.json();
        updateStats(stats);

    } catch (err) {
        console.error("Erro ao carregar dados:", err);
    }
}

function renderChart(history) {
    const ctx = document.getElementById("history-chart").getContext("2d");
    if (window.historyChart) {
        window.historyChart.destroy();
    }
    window.historyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: history.map((p) => new Date(p.t).toLocaleDateString()),
            datasets: [{
                label: "USD/BRL",
                data: history.map((p) => p.v),
                borderColor: "#4bc0c0",
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

function updateStats(stats) {
    document.getElementById("stat-last").textContent = stats.last?.toFixed(4) ?? "—";
    document.getElementById("stat-min").textContent = stats.min?.toFixed(4) ?? "—";
    document.getElementById("stat-max").textContent = stats.max?.toFixed(4) ?? "—";
    document.getElementById("stat-avg").textContent = stats.mean?.toFixed(4) ?? "—";
    document.getElementById("stat-mm7").textContent = stats.mm7?.toFixed(4) ?? "—";
    document.getElementById("stat-var").textContent =
        stats.var_pct != null ? stats.var_pct.toFixed(2) + "%" : "—";
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("refresh-btn").addEventListener("click", loadData);
    document.getElementById("days-select").addEventListener("change", loadData);

    // Carrega ao iniciar
    loadData();
});
