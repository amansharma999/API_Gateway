const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3005;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

app.use(morgan("combined"));
app.use(limiter);
//###########################################
app.use("/bookingservice", async (req, res, next) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/isauthenticated",
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});

//###########################################

app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: "http://localhost:3002/bookingservice",
    changeOrigin: true,
  })
);

// app.get("/home", (req, res) => {
//   return res.json({
//     message: "OK",
//   });
// });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
