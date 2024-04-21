const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const userRoutes=require('./routes/userRoutes')
const postRoutes=require('./routes/postRoutes')
const app = express()
require('dotenv').config()
const cookieParser=require('cookie-parser')

const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cors({origin:["http://localhost:3000"],credentials:true,methods:["GET","POST","PUT","DELETE"]}))
app.use("/threads/users",userRoutes)
app.use("/threads/posts",postRoutes)
app.use(cookieParser())


app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});





mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('====================================');
        console.log(`Backend is running and mongodb connected ...`);
        console.log('====================================');
    })
}).catch((err)=>{
    console.log(err);
})
