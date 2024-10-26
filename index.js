require('dotenv').config();
const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { fixRequestBody } = require('./middlewares/fixRequestBody');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/isauthenticated`, {
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
    target: process.env.AUTH_SERVICE_URL,
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
    target: process.env.BOOKING_SERVICE_URL,
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
    target: process.env.FLIGHTS_SERVICE_URL,
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
    target: process.env.REMINDER_SERVICE_URL,
    changeOrigin: true,
    on: { proxyReq: fixRequestBody }, // Fix for body-parser issues
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});