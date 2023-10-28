import mongoose from "mongoose";

export function connectionDB(){
    mongoose.connect(process.env.DB_ONLINE).then(()=>{
        console.log("Connected to MongoDB");
    }).catch(()=>{
        console.error("Error connecting to MongoDB")
    })
}