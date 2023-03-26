import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js"
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();
mongoose.connect("mongodb+srv://"+process.env.mongodb_user+":"+process.env.mongodb_pass+"@cluster0.bba3wy4.mongodb.net/GroceriaDatabase", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error',(error) => console.log(error))
db.once('open',() => {
  console.log("MongoDB Database connection established successfully")
})  

app.use(cors());
app.use(express.json());
app.use(ProductRoute)

app.listen(5000, function() {
  console.log(`Server started on Port 5000`)
});