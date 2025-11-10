// Selective proxy configuration to avoid noisy ECONNREFUSED on /ws when backend is down
// Only proxy API routes; leave /ws untouched until real WebSocket endpoint is implemented.
// If you later add SockJS/STOMP, you can conditionally proxy /ws based on availability.

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy only REST API calls starting with /api
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      logLevel: 'warn',
      onError(err, req, res) {
        console.warn('[Proxy] API target unreachable:', err.code);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend unreachable', code: err.code }));
      }
    })
  );

  // OPTIONAL: To proxy /ws later, uncomment below once backend WebSocket endpoint exists.
  /*
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      ws: true,
      logLevel: 'warn'
    })
  );
  */
};
