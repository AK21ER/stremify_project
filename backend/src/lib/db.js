import mongoose from "mongoose";

export const connectDb= async ()=>{
    try{
            const conn= await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongodb connected : ${conn.connection.host}`)
    }
    catch(error){
        console.log("error occured while connecting to db",error)
        process.exit(1) // 1 means failier
    }

}