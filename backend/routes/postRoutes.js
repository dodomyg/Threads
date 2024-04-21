const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const POSTS = require("../Schema/POSTS");
const USER=require("../Schema/USER")
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
});




const router = express.Router()

//create posts
router.post("/create", verifyToken, upload.single('img'), async (req, resp) => {
    const { title, img } = req.body;
    const userId = req.userId;
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorize" });
        }
        const imgPath = req.file ? req.file.filename : null;
        const newPost =  await POSTS.create({
            title,
            img: imgPath,
            owner: userId
        })
        resp.status(201).json({message:"Post created",newPost});
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id',verifyToken,async(req,resp)=>{
    const {id}=req.params
    const userId=req.userId
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });
        }
        const getUser = await POSTS.findById(id).populate("owner","name username dp").populate("likes","name username dp").populate({
            path: "comment",
            populate: { path: "userId", select: "name username dp" }
        });
        resp.status(200).json(getUser);
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})

router.get('/allPosts/:id',verifyToken,async(req,resp)=>{
    const {id}=req.params
    const userId=req.userId
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });
        }
        const allPosts = await POSTS.find({ owner: id }).sort({ createdAt: -1 }).populate("owner","name username dp").populate("likes","name username dp").populate({
            path: "comment",
            populate: { path: "userId", select: "name username dp" }
        })
        
        resp.status(200).json(allPosts);
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})


router.delete('/delete/:postId', verifyToken, async (req, resp) => {
    const userId = req.userId;
    try {
        if (!userId) {
            return resp.status(500).json({ error: "Un-authorized" });
        }
        const postToDelete = await POSTS.findById(req.params.postId);
        if (!postToDelete) {
            return resp.status(404).json({ error: "Post not found" });
        }

        if (postToDelete.owner.toString() === userId) {
            await postToDelete.deleteOne()
            return resp.status(200).json({ message: "Post deleted" });
        } else {
            return resp.status(403).json({ error: "Unauthorized, cannot delete other's post" });
        }
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
});

router.post("/like/:postId", verifyToken, async (req, resp) =>{
    const userId = req.userId;
    try {
        if (!userId) {
            return resp.status(500).json({ error: "Un-authorized" });
        }
        const getPost = await POSTS.findById(req.params.postId);
       if( getPost.likes.includes(userId)){
            await getPost.updateOne({$pull:{likes:userId}})
            resp.status(201).json({message:"Unliked"})
        }else{
            await getPost.updateOne({$push:{likes:userId}})
            resp.status(201).json({message:"Post liked"})
        }
    } catch (error) {
        resp.status(500).json({ error: "Internal server error" });
    }
})

//comment
router.post("/comment/:postId", verifyToken, async (req, resp) =>{
    const {text} = req.body;
    const userId = req.userId;
    try {
        if (!userId) {
            return resp.status(401).json({ error: "Unauthorized" });
        }
        const myComment = {
            text,
            userId:userId
        };
        const getPost = await POSTS.findById(req.params.postId);
        if (!getPost) {
            return resp.status(404).json({ error: "Post not found" });
        }
        await getPost.comment.push(myComment);
        
        await getPost.save()
        resp.status(201).json({message:"Comment added",getPost})
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
    }
});


//get post of ppl i follow










module.exports=router
