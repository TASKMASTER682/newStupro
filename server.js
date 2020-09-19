const express=require('express');
const connectDB =require("./config/db");
const auth=require('./routes/auth');
const app=express();
connectDB();
app.use(express.json({extended:false}));



app.use('/api',auth);
app.get("/",(req,res)=>res.send("API is running"));

const PORT=process.env.PORT||5000 ;
app.listen(PORT,()=> console.log(`server running at ${PORT}`)
)