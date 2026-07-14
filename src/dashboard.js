export function renderDashboard() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Demo API Observability</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f7f8fb;
        color: #172033;
      }

      body {
        margin: 0;
        min-height: 100vh;
      }

      main {
        max-width: 1120px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
        margin-bottom: 28px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 34px;
        line-height: 1.1;
      }

      p {
        margin: 0;
        color: #5d687a;
      }

      button {
        border: 0;
        background: #1f6feb;
        color: white;
        font-weight: 700;
        border-radius: 8px;
        padding: 12px 16px;
        cursor: pointer;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
      }

      .card {
        background: white;
        border: 1px solid #dbe1ea;
        border-radius: 8px;
        padding: 18px;
        box-shadow: 0 10px 24px rgba(31, 44, 71, 0.06);
      }

      .label {
        color: #6b7485;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .value {
        margin-top: 10px;
        font-size: 28px;
        font-weight: 800;
      }

      .wide {
        grid-column: span 2;
      }

      pre {
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 12px;
        line-height: 1.5;
        margin: 0;
      }

      @media (max-width: 800px) {
        header {
          display: block;
        }

        button {
          margin-top: 18px;
          width: 100%;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .wide {
          grid-column: auto;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Demo API Observability</h1>
          <p>Live service health, request metrics, and Prometheus-format telemetry from the Node.js demo API.</p>
        </div>
        <button id="refresh">Refresh metrics</button>
      </header>

      <section class="grid">
        <article class="card">
          <div class="label">Health</div>
          <div class="value" id="health">Loading</div>
        </article>
        <article class="card">
          <div class="label">Total Requests</div>
          <div class="value" id="requests">0</div>
        </article>
        <article class="card">
          <div class="label">5xx Errors</div>
          <div class="value" id="errors">0</div>
        </article>
        <article class="card">
          <div class="label">Tracked Routes</div>
          <div class="value" id="routes">0</div>
        </article>
        <article class="card wide">
          <div class="label">Latest Order API Response</div>
          <pre id="orders">Loading</pre>
        </article>
        <article class="card wide">
          <div class="label">Prometheus Metrics Sample</div>
          <pre id="sample">Loading</pre>
        </article>
      </section>
    </main>

    <script>
      async function refresh() {
        const [summaryResponse, ordersResponse, metricsResponse] = await Promise.all([
          fetch("/api/summary"),
          fetch("/api/orders"),
          fetch("/metrics")
        ]);
        const summary = await summaryResponse.json();
        const orders = await ordersResponse.json();
        const metrics = await metricsResponse.text();

        document.querySelector("#health").textContent = summary.health.toUpperCase();
        document.querySelector("#orders").textContent = JSON.stringify(orders, null, 2);
        document.querySelector("#requests").textContent = summary.total_requests;
        document.querySelector("#errors").textContent = summary.server_errors;
        document.querySelector("#routes").textContent = summary.tracked_routes;
        document.querySelector("#sample").textContent = metrics
          .split("\\n")
          .filter((line) => line.startsWith("app_http"))
          .slice(0, 12)
          .join("\\n");
      }

      document.querySelector("#refresh").addEventListener("click", refresh);
      refresh();
      setInterval(refresh, 5000);
    </script>
  </body>
</html>`;
}
