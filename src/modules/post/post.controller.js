import { postModel } from "../../../Database/models/Post.model.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/CatchError.js"
import cloudinary from "../../utils/cloudinary.js"

// add post
export const addPost = catchError(async (req, res, next) => {
    //  valid user only can add post
    if (!req.user.confirmEmail) return next(new AppError("Please confirm your email first", 400))
    if (req.user.isDeleted) return next(new AppError("Your account has been deleted", 400))
    
    // upload images is optional
    let images = []
    if (req.files) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `/Exam/post images` })
            images.push({ secure_url, public_id })
        }
    }
    // upload video is optional
    let video = null
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `/Exam/post videos` })
        video = { secure_url, public_id }
    }
    // Check if any files were uploaded
    if (images.length > 0) {
        req.body.images = images
    }
    if (video) {
        req.body.video = video
    }
    // Create a new post
    req.body.createdBy = req.user.id
    const post = await postModel.create(req.body)
    return res.status(201).json({ message: 'success', post })
})


// Update post 
export const updatePost = catchError(
    async (req, res, next) => {
        // Get post
        const postId = req.params.id
        const post = await postModel.findById(postId)
        // post owner only
        if (post.createdBy.toString() !== req.user.id.toString()) {
            return next(new AppError('You are not authorized to update this post', 401))
        }
        // Update post
        const postUpdated = await postModel.findByIdAndUpdate(post._id,
              req.body, {new: true})
        return res.status(200).json({message:'success', postUpdated})
})

// Delete post 
export const deletePost = catchError(
    async (req, res, next) => {
        // Get post
        const postId = req.params.id
        const post = await postModel.findById(postId)
        if(!post) return next(new AppError("Post not found", 404))
        // post owner only
        if (post.createdBy.toString()!== req.user.id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to delete this post' });
        }
        // delete images
        post.images.map((image)=>{
            cloudinary.uploader.destroy(image.public_id);
            console.log(image.public_id)
        })
        // delete post's comments
        post.isDeleted = true
        post.comments = []
        post.likes = []
        await post.save()
        return res.status(200).json({message:'success'})
})

// Get all posts 
export const getAllPosts = catchError(
    async (req, res, next) => {
        // isDeleted equal true can’t get posts
        if(req.user.isDeleted) return next(new AppError("Your account has been deleted", 400))
        const apiFeatures = new ApiFeatures(postModel.find().populate('comments'), req.query)
            .paginate().fields().filter().sort().search()
             
        // exeute query
        const posts = await apiFeatures.mongooseQuery
        return res.status(201).json({
            message: "success",
            resulte: posts.length,
            pageNumber: apiFeatures.pageNumber,
            posts
        })
})

// Get post by id
export const getPostById = catchError(
    async (req, res, next) => {
        const postId = req.params.id
        const post = await postModel.findById(postId).populate('comments')
        if(!post){
            return next(new AppError("Post not found", 404))
        }
        return res.status(200).json({message:"success", post})
})

// like post (user can like the post only one time )
export const likePost = catchError(
    async (req, res, next) => {
        const postId = req.params.id
        const post = await postModel.findById(postId)
        // check if post not found
        if(!post) return next(new AppError("Post not found", 404))
        // check if user already like this post
        if(post.likes.includes(req.user.id)) return next(new AppError("You already like this post", 400))
        // like post
        post.likes.push(req.user.id)
        await post.save()
        return res.status(200).json({message: "success"})
})
    
// unlike post (user can unlike the post only one time )
export const unlikePost = catchError(
    async (req, res, next) => {
        const postId = req.params.id
        const post = await postModel.findById(postId)
        if(!post){
            return next(new AppError("Post not found", 404))
        }
        // check if user already unlike this post
        if(!post.likes.includes(req.user.id)){
            return res.status(400).json({message: "You already unlike this post"})
        }
        // unlike post
        post.likes.pull(req.user.id)
        await post.save()
        return res.status(200).json({message: "success"})
})

// update post privacy
export const changePrivacyPost = catchError(
    async (req ,res, next)=>{
        const postId = req.params.id
        const {privacy} = req.body
        const post = await postModel.findById(postId)
        if(!post){
            return next(new AppError("Post not found", 404))
        }
        await postModel.findByIdAndUpdate(post._id,{privacy},{new:true})
        return res.status(200).json({message: "success"})
})

// get posts created yesterday
export const getPostsCreatedYesterday = catchError(
    async (req, res, next) => {
        const yesterday = new Date(Date.now() - 24*60*60*1000);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date(Date.now() - 24*60*60*1000);
        today.setHours(23, 59, 59, 999);

        const apiFeatures = new ApiFeatures(postModel.find({
            createdAt: {
                $gte: yesterday,
                $lt: today
            }
        }).populate('comments'), req.query).paginate().fields().filter().sort().search()
             
        // exeute query
        const posts = await apiFeatures.mongooseQuery
        
        return res.status(201).json({
            message: "success",
            resulte: posts.length,
            pageNumber: apiFeatures.pageNumber,
            posts
        })
});

// get posts created today
export const getPostsCreatedToday = catchError(
    async (req, res, next) => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        
        const apiFeatures = new ApiFeatures(postModel.find({
            createdAt: {
                $gte: todayStart,
                $lt: todayEnd
            }
        }).populate('comments'), req.query).paginate().fields().filter().sort().search()
             
        // exeute query
        const posts = await apiFeatures.mongooseQuery
        
        return res.status(201).json({
            message: "success",
            resulte: posts.length,
            pageNumber: apiFeatures.pageNumber,
            posts
        })
});
