import { commentModel } from "../../../Database/models/Comment.model.js"
import { postModel } from "../../../Database/models/Post.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/CatchError.js"

// add Comment
export const addComment = catchError(
    async (req, res, next) =>{
        const post = await postModel.findById(req.body.PostId)
        // check if post not found
        if(!post) return next(new AppError("Post not found", 404))
        // check if post is deleted
        if(post.isDeleted) next(new AppError("post is deleted", 404))
        // check if user is deleted
        if(req.user.isDeleted) return next(new AppError("Your account has been deleted", 400))
        // create comment
        req.body.createdBy = req.user.id
        const comment = await commentModel.create(req.body)
        await postModel.findByIdAndUpdate(post._id, {$addToSet: {comments: comment._id}}, {new: true })
        return res.status(201).json({message: "success", comment})
    }
)

// update comment
export const editComment = catchError(
    async (req ,res, next)=>{
        const commentId = req.body.commentId
        const comment = await commentModel.findById(commentId)
        // check if comment not found
        if(!comment) return next(new AppError("comment not found", 404))
        // comment owner only
        if (comment.createdBy.toString() !== req.user.id.toString()) {
            return next(new AppError('You are not authorized to update this comment', 401))
        }
        // update comment in database and save it
            const updatedComment = await commentModel.findOneAndUpdate({_id: commentId},
                 {commentBody: req.body.commentBody}, {new: true})
            return res.status(200).json({message: "success", comment: updatedComment});
})

// Delete comment
export const deleteComment = catchError(
    async (req,res, next)=>{
        const commentId = req.params.id
        const comment = await commentModel.findById(commentId)
        // check if comment not found
        if(!comment) return next(new AppError("comment not found", 404))
        // comment owner only
        if (comment.createdBy.toString()!== req.user.id.toString()) {
            return next(new AppError('You are not authorized to delete this comment', 401))
        }
        // delete comment in database and save it
        await commentModel.findOneAndDelete({_id: commentId})

        return res.status(200).json({message: "success"});
})

// like Comment 
export const likeComment = catchError(
    async (req, res, next) => {
        const commentId = req.body.commentId
        const comment = await commentModel.findById(commentId)
        // check if comment not found
        if(!comment) return next(new AppError("Comment not found", 404))
        // check if user already like this comment
        if(comment.likes.includes(req.user.id)) return next(new AppError("You already like this post", 400))
        // like post
        comment.likes.push(req.user.id)
        await comment.save()
        return res.status(200).json({message: "success"})
})
    
// unlike Comment 
export const unlikeComment = catchError(
    async (req, res, next) => {
        const commentId = req.body.commentId
        const comment = await commentModel.findById(commentId)
        if(!comment){
            return next(new AppError("comment not found", 404))
        }
        // check if user already unlike this comment
        if(!comment.likes.includes(req.user.id)){
            return res.status(400).json({message: "You already unlike this comment"})
        }
        // unlike comment
        comment.likes.pull(req.user.id)
        await comment.save()
        return res.status(200).json({message: "success"})
})
