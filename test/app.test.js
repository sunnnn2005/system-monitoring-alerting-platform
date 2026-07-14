import assert from "node:assert/strict";
import test from "node:test";

import request from "supertest";

import { createApp } from "../src/app.js";

test("health endpoint returns service status", async () => {
  const response = await request(createApp()).get("/health").expect(200);

  assert.deepEqual(response.body, {
    status: "ok",
    service: "demo-api"
  });
});

test("root endpoint lists key demo endpoints", async () => {
  const response = await request(createApp()).get("/").expect(200);

  assert.equal(response.body.message, "System Monitoring & Alerting Platform demo service");
  assert.ok(response.body.endpoints.includes("/metrics"));
  assert.ok(response.body.endpoints.includes("/dashboard"));
  assert.ok(response.body.endpoints.includes("/api/summary"));
});

test("metrics endpoint exposes Prometheus application counters", async () => {
  const app = createApp();

  await request(app).get("/health").expect(200);
  const response = await request(app).get("/metrics").expect(200);

  assert.match(response.text, /# HELP app_http_requests_total/);
  assert.ok(response.text.includes('route="/health"'));
});

test("summary endpoint aggregates request counters", async () => {
  const app = createApp();

  await request(app).get("/health").expect(200);
  await request(app).get("/api/summary").expect(200);
  const response = await request(app).get("/api/summary").expect(200);

  assert.equal(response.body.health, "ok");
  assert.ok(response.body.total_requests >= 2);
  assert.ok(response.body.tracked_routes >= 2);
});

test("dashboard endpoint renders the observability UI", async () => {
  const response = await request(createApp()).get("/dashboard").expect(200);

  assert.match(response.text, /Demo API Observability/);
  assert.match(response.text, /Prometheus Metrics Sample/);
});
