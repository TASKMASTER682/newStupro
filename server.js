const express=require('express');
const morgan=require('morgan');
const compression = require("compression");
const cors=require('cors');
const cookieParser=require('cookie-parser');
require('dotenv').config();
const connectDB=require('./config/db')
// const bodyParser=require('body-parser');
//bring routes
const auth=require('./routes/auth');
const blogRoutes=require('./routes/blog');
const jobRoutes=require('./routes/job');
const privateJobRoutes=require('./routes/privateJob');
const tagRoutes=require('./routes/tag');
const categoryRoutes=require('./routes/category');
const jobTagRoutes=require('./routes/jobTag');
const privateJobTagRoutes=require('./routes/privateJobTag');
const privateJobCategoryRoutes=require('./routes/privateJobCategory');
const jobCategoryRoutes=require('./routes/jobCategory');
const userRoutes = require('./routes/user');
const formRoutes = require('./routes/form');
const materialRoutes=require('./routes/material');
const materialCategoryRoutes=require('./routes/materialCategory')

const app=express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} 
connectDB();
app.use(express.json({limit: '100mb',extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(compression());

process.setMaxListeners(Infinity);

//routes
app.use('/api',auth);
app.use('/api',blogRoutes);
app.use('/api',jobRoutes);
app.use('/api',privateJobRoutes);
app.use('/api',categoryRoutes);
app.use('/api',tagRoutes);
app.use('/api',jobCategoryRoutes);
app.use('/api',jobTagRoutes);
app.use('/api',privateJobCategoryRoutes);
app.use('/api',privateJobTagRoutes);
app.use('/api', userRoutes);
app.use('/api', formRoutes);
app.use('/api',materialRoutes);
app.use('/api',materialCategoryRoutes)
const port=process.env.PORT||8000;
app.listen(port,()=>{console.log(`server is running on port ${port}`)});