import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js'
import bookRouter from './routes/book.routes.js'
import favouritesRouter from './routes/favourites.routes.js'
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"

//declaration of routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/book", bookRouter)
app.use("/api/v1/favourites", favouritesRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/order", orderRouter)

export {app}