# System Monitoring & Alerting Platform

An observability project for a containerized web service. The app exposes runtime
metrics, Prometheus scrapes them, Grafana visualizes service health, and
Alertmanager can route alerts to Slack.

## Why This Project

This project shows backend engineering plus infrastructure awareness: metrics,
dashboards, alert thresholds, and incident response. It is designed to be small
enough to build as a student project while still looking like a real engineering
system.

## Tech Stack

- Node.js + Express
- Prometheus client metrics
- Docker Compose
- Prometheus
- Grafana
- Alertmanager
- Slack webhook integration

## MVP Features

- Health endpoint for uptime checks
- Metrics endpoint for Prometheus scraping
- Simulated API endpoint with request latency and occasional errors
- Lightweight local dashboard at `/dashboard`
- Traffic generator for producing realistic demo metrics
- Prometheus scrape configuration
- Alert rules for high error rate and high latency
- Grafana dashboard provisioning
- Alertmanager Slack receiver configuration template

## Resume Bullets

- Built an observability platform for a containerized Node.js service, exposing
  application health, request latency, error rate, and runtime metrics through
  Prometheus.
- Designed monitoring workflows with Prometheus alert rules and Grafana-ready
  metrics for service uptime, request throughput, CPU/memory usage, and latency
  trends.
- Configured Alertmanager routing for abnormal latency and error spikes, enabling
  Slack notifications for faster incident detection and debugging.

## Local Run

```bash
npm install
npm start
```

Open:

- Local dashboard: http://localhost:3000/dashboard
- Health check: http://localhost:3000/health
- Demo API: http://localhost:3000/api/orders
- Prometheus metrics: http://localhost:3000/metrics

Generate demo traffic:

```bash
npm run load
```

Run tests:

```bash
npm test
```

## Docker Run

Docker Compose starts the Node service, Prometheus, Alertmanager, and Grafana:

```bash
docker compose up --build
```

Service URLs:

- App: http://localhost:3000
- Local dashboard: http://localhost:3000/dashboard
- Metrics: http://localhost:3000/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

Grafana login:

- Username: `admin`
- Password: `admin`

The Grafana dashboard is provisioned from
`grafana/dashboards/demo-api-dashboard.json`.

## Verification Notes

Verified locally:

- `/health` returns service status
- `/api/orders` returns simulated order data with variable latency
- `/api/summary` returns dashboard-ready aggregate metrics
- `/metrics` exposes Prometheus-format Node.js and application metrics
- `scripts/generate-traffic.js` produces request volume and simulated failures
- Node test suite covers health, summary, metrics, and dashboard endpoints

## Project Roadmap

- Add service-level objective tracking
- Add runbook documentation for alerts
- Add Go version of the metrics service as a stretch goal
