const jwt =require('jsonwebtoken')

const verifyToken=(req,resp,next)=>{
   try {
    
     const token = req.headers.cookie.split("=")[1]
     if(!token){
      return req.status(500).json({error:"token not found"})
     }
     jwt.verify(token,"threadsClone",(err,decoded)=>{
        if(err){
         return req.status(500).json({error:"invalid token"})
        }
        req.userId = decoded.id
     })
    
   
   } catch (error) {
    console.log(error);
   }

   next()


}

module.exports=verifyToken