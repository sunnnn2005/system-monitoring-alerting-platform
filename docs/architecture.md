# Architecture

This project models a small production-style observability stack for a
containerized API service.

## Components

- **Demo API:** Express service that exposes health, demo business endpoints,
  dashboard summaries, and Prometheus metrics.
- **Prometheus:** Scrapes `/metrics` from the API and evaluates alert rules.
- **Grafana:** Provisions a dashboard for request volume, latency, error rate,
  and service health.
- **Alertmanager:** Receives alerts from Prometheus and can route them to Slack.
- **Traffic generator:** Creates realistic demo traffic so dashboards and alerts
  have data to display during a local demo.

## Data Flow

1. Users or the traffic generator call the demo API.
2. Express middleware records request counts, latency, and status codes.
3. The API exposes metrics at `/metrics` in Prometheus format.
4. Prometheus scrapes the API and evaluates alert rules.
5. Grafana reads Prometheus data for dashboard visualizations.
6. Alertmanager routes high-latency or high-error alerts to a configured
   receiver.

## Reliability Scenarios

- **High latency:** Alert rule triggers when request duration stays above the
  configured threshold.
- **Error spike:** Alert rule triggers when 5xx responses increase.
- **Service down:** Prometheus can detect scrape failures or unhealthy checks.

## Design Tradeoffs

- The API is intentionally small so the observability workflow is easy to run
  locally.
- Slack credentials are kept out of the default config. The repository includes
  an example Alertmanager config for safe setup.
- Grafana provisioning is committed so the dashboard appears automatically when
  Docker Compose starts.
