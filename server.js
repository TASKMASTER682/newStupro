const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const cookieParser=require('cookie-parser');
require('dotenv').config();
const connectDB=require('./config/db')
const bodyParser=require('body-parser');
//bring routes
const auth=require('./routes/auth');
const blogRoutes=require('./routes/blog');
const tagRoutes=require('./routes/tag');
const categoryRoutes=require('./routes/category');

const app=express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} 
connectDB();


app.use(express.json({extended:false}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use('/api',auth);
app.use('/api',blogRoutes);
app.use('/api',categoryRoutes);
app.use('/api',tagRoutes);


const port=process.env.PORT||8000;
app.listen(port,()=>{console.log(`server is running on port ${port}`)});