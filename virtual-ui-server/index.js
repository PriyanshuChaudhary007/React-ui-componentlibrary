import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./configs/connectDB.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import componentRouter from "./routes/component.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();

/* ✅ Allowed origins come from env so the same code works locally and in prod.
   CLIENT_URL accepts a comma separated list. */
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ✅ Body parser */
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Virtual UI Backend Running 🚀" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/component", componentRouter);
app.use("/api/payment", paymentRouter);

/* ✅ Connect on cold start so serverless invocations also get a DB. */
connectDB();

/* ✅ Only bind a port when running as a normal process (local / VPS).
   On Vercel the app is consumed as a serverless handler instead. */
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

export default app;
