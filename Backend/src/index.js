import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import {app} from "../src/app.js";
import {initVectorStore} from "./utils/vectors.js";

dotenv.config({
    path: './.env'
})

connectDB()

.then(() => {
    return initVectorStore();
})

.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})

.catch((err) => {
    console.log ("MONGODB connection failed !!" , err);
})


