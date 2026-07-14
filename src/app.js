import express from "express";
import client from "prom-client";

import { renderDashboard } from "./dashboard.js";
import { buildMetricsSummary } from "./metrics-summary.js";

export function createApp() {
  const app = express();

  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  const httpRequests = new client.Counter({
    name: "app_http_requests_total",
    help: "Total HTTP requests by route, method, and status code",
    labelNames: ["method", "route", "status_code"],
    registers: [register]
  });

  const requestDuration = new client.Histogram({
    name: "app_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [register]
  });

  function observeRequest(route, method, statusCode, startedAt) {
    const labels = { method, route, status_code: String(statusCode) };
    httpRequests.inc(labels);
    requestDuration.observe(labels, (Date.now() - startedAt) / 1000);
  }

  app.get("/health", (req, res) => {
    observeRequest("/health", req.method, 200, Date.now());
    res.json({ status: "ok", service: "demo-api" });
  });

  app.get("/api/orders", async (req, res) => {
    const startedAt = Date.now();
    const simulatedLatencyMs = 50 + Math.floor(Math.random() * 950);
    const shouldFail = Math.random() < 0.08;

    await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs));

    if (shouldFail) {
      observeRequest("/api/orders", req.method, 500, startedAt);
      res.status(500).json({ error: "simulated upstream failure" });
      return;
    }

    observeRequest("/api/orders", req.method, 200, startedAt);
    res.json({
      orders: [
        { id: "ord_1001", total: 42.5, status: "paid" },
        { id: "ord_1002", total: 19.99, status: "processing" }
      ],
      latency_ms: simulatedLatencyMs
    });
  });

  app.get("/api/summary", async (req, res) => {
    observeRequest("/api/summary", req.method, 200, Date.now());
    res.json(await buildMetricsSummary(register));
  });

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  app.get("/dashboard", (req, res) => {
    observeRequest("/dashboard", req.method, 200, Date.now());
    res.type("html").send(renderDashboard());
  });

  app.get("/", (req, res) => {
    observeRequest("/", req.method, 200, Date.now());
    res.json({
      message: "System Monitoring & Alerting Platform demo service",
      endpoints: ["/health", "/api/orders", "/api/summary", "/metrics", "/dashboard"]
    });
  });

  return app;
}
