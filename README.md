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

## How it works

The proxy server will:
1. Accept incoming requests on the specified port
2. Check if the request host is *.daily.co or prod-ks.pluot.blue
3. If matched, forward the request to the appropriate target
4. If not matched, return a 404 response
5. Handle WebSocket upgrade requests for supported domains
