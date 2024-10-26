const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3005;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 50, // limit each IP to 50 requests per windowMs
});

app.use(morgan("combined"));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check JWT token by calling AuthService
const authenticate = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const response = await axios.get('http://localhost:3001/authservice/api/v1/isauthenticated', {
      headers: { 'x-access-token': token },
    });
    if (response.data.success) {
      next();
    } else {
      res.status(401).json({ message: 'Failed to authenticate token' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Failed to authenticate token' });
  }
};

// Route to AuthService
app.use(
  '/authservice',
  createProxyMiddleware({
    target: 'http://localhost:3001/authservice',
    changeOrigin: true,
    on: { proxyReq: fixRequestBody }, // Fix for body-parser issues
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);

// Route to BookingService (protected)
app.use(
  '/bookingservice',
  authenticate,
  createProxyMiddleware({
    target: 'http://localhost:3002/bookingservice',
    changeOrigin: true,
    on: { proxyReq: fixRequestBody }, // Fix for body-parser issues
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);

// Route to FlightsAndSearchService 
app.use(
  '/flightsservice', 
  createProxyMiddleware({
    target: 'http://localhost:3000/flightsservice',
    changeOrigin: true,
    on: { proxyReq: fixRequestBody }, // Fix for body-parser issues
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);


// Route to ReminderService (protected)
app.use(
  '/reminderservice',
  authenticate,
  createProxyMiddleware({
    target: 'http://localhost:3004/reminderservice',
    changeOrigin: true,
    on: { proxyReq: fixRequestBody }, // Fix for body-parser issues
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});