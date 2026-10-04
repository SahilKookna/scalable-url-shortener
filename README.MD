<h1 align="center">Scalable URL Shortener 🔗</h1>

<p align="center">
    <img alt="Scalable URL Shortener Banner" src="https://raw.githubusercontent.com/SahilKookna/scalable-url-shortener/main/client/src/assets/images/shorurl.jpg" width="700" />
</p>

<h3 align="center">A distributed, highly available, fault-tolerant URL Shortening engine built with Node.js, Express, Redis, Apache ZooKeeper, and MongoDB.</h3>

---

## 📚 Overview

**Scalable URL Shortener** is an enterprise-grade distributed system designed to handle high-throughput link generation and redirection at scale.

### Architecture Highlights
- **Caching Layer**: Redis distributed in-memory cache for ultra-low latency link resolution.
- **Persistent Store**: MongoDB NoSQL database for long-term URL mapping storage.
- **Reverse Proxy & Load Balancer**: Nginx distributing traffic seamlessly across scaled node server instances.
- **Distributed Token Allocation**: Apache ZooKeeper to allocate range tokens for unique hash generation, eliminating race conditions across multiple server nodes.
- **Containerized Orchestration**: Complete Docker Compose & Kubernetes ready configuration.

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Kubernetes enabled if using k8s)
- Node.js v16+ (optional for local non-containerized running)

### 1. Clone the Repository

```bash
git clone https://github.com/SahilKookna/scalable-url-shortener.git
cd scalable-url-shortener
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_MONGODB_URI="mongodb://mongo:27017/shorturl"
REACT_APP_REDIS_PORT=6379
REACT_APP_REDIS_HOST="redis-server"
ZOOKEEPER_HOST="zookeeper-server:2181"
```

### 3. Spin Up Containers

Start the full stack with Docker Compose:

```bash
docker compose up --build
```

To scale backend nodes dynamically for high availability:

```bash
docker compose up --build --scale node-server=3
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/url` | Shorten original URL (Body: `{"OriginalUrl": "https://example.com"}`) |
| `GET` | `/url/:identifier` | Redirect to original target URL |
| `GET` | `/health` | Check service health status |
| `GET` | `/del` | Remove ZooKeeper token range node |

### Service Endpoints
- **Frontend Client UI**: `http://localhost:3000/`
- **Load-Balanced Backend API**: `http://localhost:4000/`

---

## 📘 System Architecture & Data Flow

<p align="center">
    <img alt="Get URL Architecture" src="https://raw.githubusercontent.com/SahilKookna/scalable-url-shortener/main/client/src/assets/images/getURLs.png" width="48%" />
    <img alt="Redirect Architecture" src="https://raw.githubusercontent.com/SahilKookna/scalable-url-shortener/main/client/src/assets/images/redirect.png" width="48%" />
</p>

### Key System Design Trade-offs
- **Eventually Consistent Design**: High availability and low latency redirection take priority over immediate cross-datacenter consistency (CAP Theorem trade-off).
- **ZooKeeper Token Range Distribution**: Nodes fetch ranges (e.g. 1,000,000 IDs at a time) to locally generate Base62 hash strings without network synchronization bottlenecks.

---

## 🧑🏽 Author

**Sahil Kookna**
- GitHub: [@SahilKookna](https://github.com/SahilKookna)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE) - Copyright © 2024 **Sahil Kookna**.
