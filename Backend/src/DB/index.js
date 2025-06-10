import mongoose from 'mongoose';
import { DB_name }from "../constants.js";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MongoDB_URI}/${DB_name}`)
        console.log(`\n MongoDB connected successfully ! DB host: ${connection.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection messed up! ", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;