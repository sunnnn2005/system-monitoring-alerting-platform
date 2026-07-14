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
- Prometheus scrape configuration
- Alert rules for high error rate and high latency
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
docker compose up --build
```

Service URLs:

- App: http://localhost:3000
- Metrics: http://localhost:3000/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## Project Roadmap

- Add Grafana dashboard JSON
- Add load-testing script for realistic traffic
- Add service-level objective tracking
- Add runbook documentation for alerts
- Add Go version of the metrics service as a stretch goal
