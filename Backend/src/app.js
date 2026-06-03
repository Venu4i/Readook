import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))
app.use(cookieParser())

//importing routes
import userRouter from './routes/user.routes.js'
import bookRouter from './routes/book.routes.js'
import favouritesRouter from './routes/favourites.routes.js'
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import adminRouter from "./routes/admin.routes.js"
import complaintRouter from "./routes/complaint.routes.js"
import aiRouter from "./routes/ai.routes.js";
import otpRouter from "./routes/otp.routes.js";

//declaration of routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/book", bookRouter)
app.use("/api/v1/favourites", favouritesRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/complaint", complaintRouter)
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/otp", otpRouter);

app.use((err,_, res, next) => {
  console.error("🔥 Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export {app}