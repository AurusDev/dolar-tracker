(function () {
    // auxiliares
    const $ = (idA, idB) => document.getElementById(idA) || document.getElementById(idB);
    const btn = $("refresh", "refresh-btn");
    const sel = $("days", "days-select");

    async function jget(url) {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw new Error(`${url} -> ${r.status}`);
        return r.json();
    }

    function setTxt(id, val, suffix = "") {
        const el = document.getElementById(id); if (!el) return;
        el.textContent = (val === null || val === undefined) ? "—"
            : (typeof val === "number" ? val.toFixed(4) : val) + suffix;
    }

    async function loadData() {
        try {
            const days = sel ? Number(sel.value) : 30;

            // cotação atual
            const rate = await jget("/api/rate");
            setTxt("price", Number(rate.price));
            setTxt("last-update", new Date(rate.at).toLocaleString());

            // histórico
            const hist = await jget(`/api/history?days=${days}`);
            drawChart(hist);

            // estatísticas
            const stats = await jget(`/api/stats?days=${days}`);
            setTxt("stat-last", stats.last);
            setTxt("stat-min", stats.min);
            setTxt("stat-max", stats.max);
            setTxt("stat-avg", stats.mean);
            setTxt("stat-mm7", stats.ma7 ?? stats.mm7);
            setTxt("stat-var", stats.change_pct ?? stats.variation, "%");
        } catch (e) {
            console.error(e);
            setTxt("last-update", "Erro ao carregar dados. Abra o console (F12).");
        }
    }

    // gráfico
    let chart;
    function drawChart(series) {
        const canvas = document.getElementById("chart"); if (!canvas) return;
        const labels = series.map(p => new Date(p.t).toLocaleDateString());
        const values = series.map(p => p.v);
        if (chart) chart.destroy();
        chart = new Chart(canvas.getContext("2d"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "USD/BRL",
                    data: values,
                    borderColor: "#14ffec",
                    backgroundColor: "rgba(20,255,236,.18)",
                    borderWidth: 2, tension: .3, fill: true
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // eventos
    if (btn) btn.addEventListener("click", loadData);
    if (sel) sel.addEventListener("change", loadData);
    document.addEventListener("DOMContentLoaded", loadData);
})();
