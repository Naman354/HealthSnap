import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("MongoDB Connection Failed");
        console.error(err);
        process.exit(1);    
    }
};
 
export default connectDb;