# Pulse Traffic

[![Python](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A simulation-based traffic prediction system. Pulse Traffic generates realistic traffic sensor data, streams it to a FastAPI backend, persists it in a SQLite database, and produces near-term congestion predictions — all in real time.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [Start the Backend](#start-the-backend)
  - [Run the Simulator](#run-the-simulator)
  - [Query the API](#query-the-api)
  - [Generate a Prediction](#generate-a-prediction)
- [Configuration](#configuration)
- [Data](#data)
- [Development](#development)
- [Reproducibility](#reproducibility)
- [License](#license)

---

## Overview

Pulse Traffic is a pipeline that:

1. **Simulates** traffic sensor readings using configurable scenarios (normal flow, peak hour, low traffic, sudden spikes, and deliberately faulty data for validation testing).
2. **Ingests** those readings through a REST API (FastAPI) with strict Pydantic schema validation.
3. **Stores** each reading in a local SQLite database via SQLAlchemy.
4. **Predicts** near-term congestion level (Low / Medium / High) for any sensor node on demand, based on a moving average of recent speed readings with an associated confidence score.

**Intended use cases**

- Prototyping traffic-monitoring dashboards and data pipelines.
- Testing backend resilience against malformed or out-of-range sensor payloads.
- Studying the effect of different traffic scenarios on congestion predictions.
- Educational reference for FastAPI + Pydantic + SQLAlchemy projects.

---

## Features

- **Five traffic scenarios** — normal, peak hour, low traffic, sudden spike, and faulty data.
- **Fault injection** — deliberately generates invalid payloads to verify backend validation.
- **Configurable simulator** — interval, retries, timeout, node ID, random seed, and backend URL are all CLI arguments.
- **RESTful backend** — `POST /traffic-data` to ingest, `GET /traffic-data` to retrieve, `POST /predict/{node_id}` for on-demand predictions.
- **Congestion prediction** — rule-based 1-hour forecast with confidence scores.
- **Interactive API docs** — auto-generated Swagger UI at `/docs`.
- **Reproducible runs** — pass `--seed` to the simulator for deterministic output.

### Roadmap

- [ ] Swap rule-based prediction with a machine-learning model (e.g. LSTM or gradient boosting).
- [ ] Add a real-time dashboard (WebSocket or polling).
- [ ] Support multiple simultaneous sensor nodes.
- [ ] Containerise the full stack with Docker Compose.
- [ ] Add CI workflow for automated testing.

---

## Architecture

```
Simulator (Python)
  ├── config.py    — runtime configuration (dataclass, JSON load/save)
  ├── scenarios.py — traffic data generation per scenario
  ├── generator.py — orchestrates scenario sampling and fault injection
  ├── sender.py    — HTTP POST with retry logic
  ├── logger.py    — structured logging
  └── main.py      — CLI entrypoint

        │  POST /traffic-data
        ▼

Backend (FastAPI)
  ├── schemas.py          — Pydantic input/output models
  ├── models.py           — SQLAlchemy ORM tables
  ├── database.py         — SQLite engine and session factory
  ├── prediction_logic.py — congestion prediction (moving average)
  └── main.py             — FastAPI app and route definitions

        │  SQLite
        ▼

  traffic_data.db
  ├── traffic_readings        — raw sensor readings
  └── congestion_predictions  — generated forecasts
```

---

## Project Structure

```
Pulse-traffic/
├── backend/
│   ├── main.py              # FastAPI application and route definitions
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── models.py            # SQLAlchemy ORM models
│   ├── database.py          # Database engine and session
│   ├── prediction_logic.py  # Congestion prediction logic
│   ├── requirements.txt     # Backend Python dependencies
│   └── tests/
│       └── test_main.py     # Backend API tests
├── simulator/
│   ├── main.py              # Simulator CLI entrypoint
│   ├── config.py            # SimulatorConfig dataclass
│   ├── scenarios.py         # Scenario data generators
│   ├── generator.py         # TrafficGenerator (sampling + fault injection)
│   ├── sender.py            # HTTP sender with retries
│   ├── logger.py            # Logger setup
│   ├── requirements.txt     # Simulator Python dependencies
│   └── tests/
│       └── test_simulator.py
├── INTEGRATION.md           # Detailed integration guide
├── LICENSE                  # MIT License
└── README.md
```

---

## Installation

**Requirements:** Python 3.11 or later.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Key backend dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `httpx`, `pytest`.

### Simulator

```bash
# From the project root (so that `simulator` is a package)
python -m venv venv            # or reuse the same venv
source venv/bin/activate
pip install -r simulator/requirements.txt
```

Key simulator dependencies: `requests`, `pydantic`, `pytest`.

> **Note:** The simulator must be run from the project root so Python can resolve the `simulator` package correctly.

---

## Usage

### Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive docs: `http://127.0.0.1:8000/docs`

### Run the Simulator

Open a **second terminal** from the project root and run one of the following scenarios:

```bash
# Normal mixed-flow conditions (default)
python -m simulator.main --scenario normal

# Heavy peak-hour congestion
python -m simulator.main --scenario peak_hour

# Free-flow low-traffic conditions
python -m simulator.main --scenario low_traffic

# Alternating normal and sudden congestion spikes
python -m simulator.main --scenario sudden_spike

# Fault injection — tests backend validation robustness
python -m simulator.main --scenario faulty_data --fault-injection --allow-invalid-payloads
```

The simulator sends one payload every 2 seconds by default and logs each transmission:

```
2026-04-23 14:22:45 - INFO - Sent payload {'vehicle_count': 54, 'speed': 62.3, ...} with status 201
2026-04-23 14:22:49 - WARNING - Send attempt 1 failed: Connection refused
```

### Query the API

```bash
# Retrieve the most recent 50 readings
curl "http://127.0.0.1:8000/traffic-data?limit=50"

# Filter by sensor node
curl "http://127.0.0.1:8000/traffic-data?node_id=sensor-1&limit=10"
```

### Generate a Prediction

```bash
curl -X POST "http://127.0.0.1:8000/predict/simulator"
```

Example response:

```json
{
  "id": 1,
  "node_id": "simulator",
  "target_time": "2026-04-23T15:22:45Z",
  "predicted_level": "Low",
  "confidence_score": 90.0
}
```

Prediction levels and logic:

| Avg speed (last 5 readings) | Congestion level | Confidence |
|-----------------------------|------------------|------------|
| < 20 km/h                   | High             | 85 %       |
| 20 – 39 km/h                | Medium           | 75 %       |
| ≥ 40 km/h                   | Low              | 90 %       |

---

## Configuration

All simulator options are passed as CLI arguments:

```bash
python -m simulator.main \
  --backend-url http://custom-backend:8000/traffic-data \
  --scenario peak_hour \
  --interval 1.5 \
  --node-id sensor-1 \
  --retries 3 \
  --timeout 10 \
  --seed 42
```

| Argument                  | Default                                    | Description                                              |
|---------------------------|--------------------------------------------|----------------------------------------------------------|
| `--backend-url`           | `http://127.0.0.1:8000/traffic-data`       | Backend API endpoint                                     |
| `--scenario`              | `normal`                                   | Traffic scenario (`normal`, `peak_hour`, `low_traffic`, `sudden_spike`, `faulty_data`) |
| `--interval`              | `2.0`                                      | Seconds between data points                              |
| `--node-id`               | `simulator`                                | Sensor node identifier sent in each payload              |
| `--retries`               | `2`                                        | Number of HTTP retry attempts on failure                 |
| `--timeout`               | `5.0`                                      | HTTP request timeout in seconds                          |
| `--fault-injection`       | `False`                                    | Enable malformed payload generation (use with `faulty_data` scenario) |
| `--allow-invalid-payloads`| `False`                                    | Send payloads that fail local validation (for backend rejection testing) |
| `--seed`                  | `None`                                     | Integer random seed for reproducible output              |

The `SimulatorConfig` dataclass (`simulator/config.py`) also supports loading from and saving to a JSON file:

```python
from simulator.config import SimulatorConfig

config = SimulatorConfig.load("my_config.json")
config.save("my_config.json")
```

---

## Data

Pulse Traffic generates all data synthetically — no external datasets are required.

**Payload schema:**

| Field           | Type    | Constraints              | Description                     |
|-----------------|---------|--------------------------|---------------------------------|
| `vehicle_count` | integer | 0 – 200                  | Number of vehicles detected     |
| `speed`         | float   | 0 – 120 km/h             | Average speed                   |
| `density`       | float   | 0.0 – 1.0                | Traffic density ratio           |
| `timestamp`     | string  | ISO 8601 UTC             | Time of reading                 |
| `node_id`       | string  | optional, default `simulator` | Sensor node identifier     |

**Storage:** The backend creates `traffic_data.db` (SQLite) automatically on first start. The file is created in the `backend/` directory. It is not committed to the repository (see `.gitignore`).

---

## Development

### Running Tests

**Backend tests:**

```bash
cd backend
python -m pytest tests/ -v
```

**Simulator tests:**

```bash
# Run from the project root
python -m pytest simulator/tests/test_simulator.py -v
```

Tests cover:

- Generated data values stay within valid ranges for each scenario.
- Scenario relative ordering (peak-hour density > low-traffic density).
- Timestamp serialisation in UTC ISO 8601 format.
- Retry logic under connection failures.
- Correct fault injection behaviour.

### Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies for both components (see [Installation](#installation)).
3. Make your changes and add or update tests as appropriate.
4. Run the test suites and confirm all tests pass before opening a pull request.
5. Write a clear pull-request description explaining what changed and why.

---

## Reproducibility

To reproduce a specific simulation run exactly:

```bash
python -m simulator.main --scenario peak_hour --seed 42 --interval 1.0
```

Passing `--seed` initialises Python's `random.Random` with a fixed integer, producing the same sequence of vehicle counts, speeds, and density values every run. The backend, OS, and Python version should be kept constant across runs for bit-exact results.

**Environment snapshot (development):**

- Python 3.11+
- FastAPI 0.136.0, SQLAlchemy 2.0.49, Pydantic 2.13.2, Uvicorn 0.44.0
- Pytest 9.0.3
- SQLite (bundled with Python)

---

## License

This project is licensed under the [MIT License](LICENSE).

