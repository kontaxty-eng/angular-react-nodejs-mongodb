const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('==========================================');
  console.log('SETUPPROXY.JS IS BEING EXECUTED!');
  console.log('Registering /api proxy to backend:3000');
  console.log('==========================================');
  
  const proxy = createProxyMiddleware({
    target: 'http://backend:3000',
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      console.log('[Proxy] Proxying request:', req.method, req.url, '-> backend:3000');
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('[Proxy] Received response:', proxyRes.statusCode, 'for', req.url);
    },
    onError: (err, req, res) => {
      console.error('[Proxy] ERROR:', err.message);
    }
  });
  
  app.use('/api', proxy);
  
  console.log('Proxy middleware registered successfully!');
};
