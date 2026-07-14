export async function buildMetricsSummary(register) {
  const metrics = await register.getMetricsAsJSON();
  const requestCounter = metrics.find((metric) => metric.name === "app_http_requests_total");
  const requestValues = requestCounter?.values ?? [];

  const totalRequests = requestValues.reduce((total, item) => total + item.value, 0);
  const serverErrors = requestValues
    .filter((item) => String(item.labels.status_code).startsWith("5"))
    .reduce((total, item) => total + item.value, 0);
  const trackedRoutes = new Set(requestValues.map((item) => item.labels.route)).size;

  return {
    health: "ok",
    total_requests: totalRequests,
    server_errors: serverErrors,
    tracked_routes: trackedRoutes
  };
}
