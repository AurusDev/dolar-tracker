(function () {
    function $(idA, idB) {
        return document.getElementById(idA) || document.getElementById(idB);
    }

    const btn = $("refresh", "refresh-btn");
    const sel = $("days", "days-select");

    async function loadJSON(url) {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw new Error(`${url} -> ${r.status}`);
        return r.json();
    }

    async function loadData() {
        try {
            const days = sel ? sel.value : 30;

            // Cotação
            const rate = await loadJSON("/api/rate");
            const priceEl = document.getElementById("price");
            const timeEl = document.getElementById("last-update");
            if (priceEl) priceEl.textContent = `R$ ${Number(rate.price).toFixed(4)}`;
            if (timeEl) timeEl.textContent = new Date(rate.at).toLocaleString();

            // Histórico
            const hist = await loadJSON(`/api/history?days=${days}`);
            const canvas = document.getElementById("chart");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (window.historyChart) window.historyChart.destroy();
                window.historyChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: hist.map(p => new Date(p.t).toLocaleDateString()),
                        datasets: [{
                            label: "USD/BRL",
                            data: hist.map(p => p.v),
                            borderColor: "#14ffec",
                            backgroundColor: "rgba(20,255,236,0.15)",
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: { plugins: { legend: { display: false } }, responsive: true }
                });
            }

            // Estatísticas
            const stats = await loadJSON(`/api/stats?days=${days}`);
            setTxt("stat-last", stats.last);
            setTxt("stat-min", stats.min);
            setTxt("stat-max", stats.max);
            setTxt("stat-avg", stats.mean);
            setTxt("stat-mm7", stats.ma7 || stats.mm7);
            setTxt("stat-var", stats.change_pct ?? stats.variation, "%");

        } catch (err) {
            console.error("Falha ao carregar:", err);
            const timeEl = document.getElementById("last-update");
            if (timeEl) timeEl.textContent = "Erro ao carregar dados.";
        }
    }

    function setTxt(id, val, suffix = "") {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = (val === null || val === undefined)
            ? "—"
            : (typeof val === "number" ? val.toFixed(4) : val) + suffix;
    }

    if (btn) btn.addEventListener("click", loadData);
    if (sel) sel.addEventListener("change", loadData);

    document.addEventListener("DOMContentLoaded", loadData);
})();
