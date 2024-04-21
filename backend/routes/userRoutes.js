const express = require('express')
const bcrypt=require('bcrypt')


const jwt = require('jsonwebtoken');
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
// const USER = require('')
const USER = require("../Schema/USER");
const POSTS = require('../Schema/POSTS');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/DP'); // Specify the directory where files will be saved
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()); // Set the filename to avoid conflicts
    },
  });
  const upload = multer({ storage: storage });

const router = express.Router()


router.post("/register",async(req,resp)=>{
    const { name,username, email, password } = req.body;
    try {
        if (!name || !username || !email || !password) {
            return resp.status(400).json({ error: "Please fill all credentials" });
        }
        const existingUsername = await USER.findOne({ $or: [{ username }, { email }] });
        if (existingUsername) {
            return resp.status(400).json({ error: "Username or email already taken" });
        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt);

        const newUser = new USER({
            name,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        resp.status(201).json({ message: "User registered successfully",newUser });
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})
router.post("/login",async(req,resp)=>{
    const {username,password}=req.body
    try {
        if(!username || !password){
            return resp.status(400).json({ error: "Please fill all credentials" });
        }
        const alreadyUser = await USER.findOne({username})
        if(!alreadyUser){
            return resp.status(400).json({ error: "User cannot be found with this username" });
        }
        var enteredPw = await bcrypt.compare(password,alreadyUser.password)
        if(!enteredPw){
            return resp.status(400).json({error : "Incorrect Password"})
        }
        const token = await jwt.sign({id:alreadyUser._id},"threadsClone",{expiresIn:'5h'})
        resp.cookie("jwtToken",token,{path:'/',httpOnly:true,sameSite:'lax',expires:new Date(Date.now()+1000*21600)})
       resp.status(201).json({message:"User Logged In",alreadyUser,jwtToken:token})
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})

router.post("/logout",verifyToken,async(req,resp)=>{
    const userId=req.userId
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });   
        }
       await resp.clearCookie('jwtToken', { path: '/' });
        resp.status(201).json({ message: "Logged out successfully" });
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})


router.get("/jwt",verifyToken,async(req,resp)=>{
    const userId = req.userId;
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorize" });   
        }

        const loggedInuser = await USER.findById(userId).populate("followers","name username dp").populate("following","name username dp");
        resp.status(200).json(loggedInuser);   
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})


router.put('/update/:id', verifyToken, upload.single('dp'), async (req, resp) => {
    const { id } = req.params;
    const userId = req.userId;
    
    
    const { name, username, email, bio, password } = req.body;
  
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });
        }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
      }
  
      // Create an object to update user details
      const updateData = {
        name,
        username,
        email,
        bio,
        password: req.body.password, // Updated hashed password
      };
  
      if (req.file) {
        updateData.dp = req.file.filename;
      }
  
      const updateUser = await USER.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('followers', 'name username dp').populate('following', 'name username dp');
      resp.status(200).json(updateUser);
    } catch (error) {
      resp.status(500).json({ error: 'Internal server error' });
    }
  });


router.get('/singleUser/:id',async(req,resp)=>{
    const {id}=req.params
    try {
        const getUser = await USER.findById(id).select("-password").populate("followers","name username dp").populate("following","name username dp");


        resp.status(200).json(getUser);

    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})

router.post('/follow/:userId',verifyToken,async(req,resp)=>{
    const {userId}=req.params
    const id=req.userId
    try {
        if(userId===id){
            return  resp.status(500).json({ error: "You cannot follow yourself" });
        }
        const currentUser = await USER.findById(id);
        const followUser = await USER.findById(userId);
        if(currentUser.following.includes(userId)){
            await currentUser.updateOne({$pull:{following:userId}})
            await followUser.updateOne({$pull:{followers:id}})
            resp.status(200).json({message:`Unfollowed ${followUser.username}`})
        }
        else{
            await currentUser.updateOne({$push:{following:userId}})
            await followUser.updateOne({$push:{followers:id}})
            resp.status(200).json({message:`Followed ${followUser.username}`})
        }   
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})


router.get('/searchUser',verifyToken,async(req,resp)=>{
    const userId = req.userId
    const searchQuery = req.query.search ? {
        $and: [
            {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { username: { $regex: req.query.search, $options: 'i' } },
                ],
            },
            { _id: { $ne: userId } },
        ],
    }
  : { _id: { $ne: userId } }; 
    try {
            const findUser = await USER.find(searchQuery)
            resp.status(200).json({ findUser });
    } catch (error) {
        resp.status(500).json({message:error.message})
        
    }
})


router.get("/following",verifyToken,async(req,resp)=>{
    const userId = req.userId
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });
        }
        const loggedUser = await USER.findById(userId);
        const following = loggedUser.following
        const getPosts = await POSTS.find({ owner: { $in: following } }).sort({ createdAt: -1 }).populate("owner","name username dp").populate("likes","name username dp").populate({
            path: "comment",
            populate: { path: "userId", select: "name username dp" }
        })
        resp.status(200).json(getPosts);
    } catch (error) {
        console.log(error);
        resp.status(500).json({ error: "internal server Error" });
    }
})





module.exports=router