const express = require('express');
const httpProxy = require('http-proxy');
const http = require('http');
const url = require('url');

const app = express();
const server = http.createServer(app);

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({
  ws: true, // Enable WebSocket proxying
  secure: false // Allow self-signed certificates
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  }
});

// Middleware to check if the request should be proxied
app.use((req, res) => {
  const path = req.url.substring(1); // Remove leading slash
  const firstSlashIndex = path.indexOf('/');
  
  let targetHost, targetPath, targetPort;
  if (firstSlashIndex === -1) {
    // No additional path, use the entire path as host
    targetHost = path;
    targetPath = '/';
  } else {
    targetHost = path.substring(0, firstSlashIndex);
    targetPath = path.substring(firstSlashIndex);
  }

  // Check for port number in host
  const portIndex = targetHost.lastIndexOf(':');
  if (portIndex !== -1) {
    targetPort = targetHost.substring(portIndex + 1);
    targetHost = targetHost.substring(0, portIndex);
  }
  
  // Check if the target host is *.daily.co or prod-ks.pluot.blue
  if (targetHost.endsWith('.daily.co') || targetHost === 'prod-ks.pluot.blue') {
    const target = `https://${targetHost}${targetPort ? `:${targetPort}` : ''}`;
    console.log(`Target host: ${targetHost}, port: ${targetPort || 'default'}, path: ${targetPath}`);
    console.log(`Proxying request to: ${target}${targetPath}`);
    // Modify the request URL to include the correct path
    req.url = targetPath;
    
    proxy.web(req, res, { 
      target,
      toProxy: true,
      changeOrigin: true,
      changeOrigin: true
    });
  } else {
    // Ignore all other requests
    res.status(404).send('Not found');
  }
});

// Handle WebSocket upgrade
server.on('upgrade', (req, socket, head) => {
  const path = req.url.substring(1); // Remove leading slash
  const firstSlashIndex = path.indexOf('/');
  
  let targetHost, targetPath, targetPort;
  if (firstSlashIndex === -1) {
    // No additional path, use the entire path as host
    targetHost = path;
    targetPath = '/';
  } else {
    targetHost = path.substring(0, firstSlashIndex);
    targetPath = path.substring(firstSlashIndex);
  }

  // Check for port number in host
  const portIndex = targetHost.lastIndexOf(':');
  if (portIndex !== -1) {
    targetPort = targetHost.substring(portIndex + 1);
    targetHost = targetHost.substring(0, portIndex);
  }
  
  if (targetHost.endsWith('.daily.co') || targetHost === 'prod-ks.pluot.blue') {
    const target = `wss://${targetHost}${targetPort ? `:${targetPort}` : ''}`;
    console.log(`Target host: ${targetHost}, port: ${targetPort || 'default'}, path: ${targetPath}`);
    console.log(`Upgrading WebSocket connection to: ${target}${targetPath}`);
    // Modify the request URL to include the correct path
    req.url = targetPath;
    
    proxy.ws(req, socket, head, {
      target,
      toProxy: true,
      changeOrigin: true
    });
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
