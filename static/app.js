async function fetchData(days) {
    const res = await fetch(`/data?days=${days}`);
    return await res.json();
}

function updateUI(data) {
    if (!data || !data.length) return;

    const last = data[data.length - 1];
    document.getElementById("price").textContent = last.price.toFixed(4);
    document.getElementById("timestamp").textContent = new Date(last.timestamp).toLocaleString();

    // Estatísticas
    const prices = data.map(d => d.price);
    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = sum / prices.length;

    document.getElementById("last").textContent = last.price.toFixed(4);
    document.getElementById("min").textContent = Math.min(...prices).toFixed(4);
    document.getElementById("max").textContent = Math.max(...prices).toFixed(4);
    document.getElementById("avg").textContent = avg.toFixed(4);

    if (prices.length >= 7) {
        const mm7 = prices.slice(-7).reduce((a, b) => a + b, 0) / 7;
        document.getElementById("mm7").textContent = mm7.toFixed(4);
    } else {
        document.getElementById("mm7").textContent = "--";
    }

    const variation = ((last.price - prices[0]) / prices[0]) * 100;
    document.getElementById("variation").textContent = variation.toFixed(2) + "%";

    // Desenhar gráfico
    drawChart(data, days);
}

let chart;

function drawChart(data, days) {
    const ctx = document.getElementById("chart").getContext("2d");

    const labels = data.map(p => {
        const d = new Date(p.timestamp);
        return days <= 7
            ? d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
            : d.toLocaleDateString("pt-BR");
    });

    const prices = data.map(p => p.price);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: prices,
                borderColor: "#00f5d4",
                backgroundColor: "rgba(0, 245, 212, 0.2)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { maxRotation: 0, autoSkip: true }
                }
            }
        }
    });
}

async function refresh(days) {
    const data = await fetchData(days);
    updateUI(data);
}

document.getElementById("refresh").addEventListener("click", () => {
    const days = document.getElementById("days").value;
    refresh(days);
});

document.getElementById("days").addEventListener("change", (e) => {
    refresh(e.target.value);
});

// Inicializa com 7 dias
refresh(7);
