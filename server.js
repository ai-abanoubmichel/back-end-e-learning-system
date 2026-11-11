console.log("Step 1: Server file started");
require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const courseRouter = require("./routes/courses.route.js");
const userRouter = require("./routes/users.route.js");
const { connectDB } = require("./config/db.js");

console.log("Step 2: Express initialized");
// use cors policy
app.use(cors());
app.use(express.json());

// Routers
app.use("/uploads", express.static("uploads"));
app.use("/api", courseRouter);
app.use("/api/users", userRouter);
console.log("Step 3: Routes imported");

// Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// starting server
const startServer = async () => {
  console.log("A: Starting server...");

  try {
    console.log("B: Before connectDB");

    await connectDB();

    console.log("C: After connectDB");
  } catch (error) {
    console.log("D: Connection failed");
    console.error(error.message);
  }

  console.log("E: Starting Express...");

  app.listen(port, () => {
    console.log(`F: Server is running on port ${port}!`);
  });
};

startServer();

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
