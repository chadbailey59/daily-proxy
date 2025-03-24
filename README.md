# Daily Proxy

A Node.js proxy server that handles requests to *.daily.co and prod-ks.pluot.blue domains, including WebSocket connections.

## Features

- Proxies HTTP/HTTPS requests to *.daily.co and prod-ks.pluot.blue
- Supports WebSocket connections
- Ignores requests to all other domains
- Handles proxy errors gracefully

## Installation

```bash
npm install
```

## Usage

Start the proxy server:

```bash
npm start
```

The server will listen on port 3000 by default. You can change the port by setting the PORT environment variable:

```bash
PORT=8080 npm start
```

## Deploying

Two different zero-config deployment options:

* [Render.com](https://render.com/): Fork this repo and point it at a new web service on Render.com
* [Fly.io](https://fly.io/): Clone the repo and run `fly launch` from the command line