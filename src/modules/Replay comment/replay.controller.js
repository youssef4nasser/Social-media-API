import { commentModel } from "../../../Database/models/Comment.model.js"
import { postModel } from "../../../Database/models/Post.model.js"
import { commentReplyModel } from "../../../Database/models/commentReplay.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/CatchError.js"

// add Replay comment
export const addReplay = catchError(
    async (req, res, next) =>{
        const post = await postModel.findById(req.body.postId)
        const comment = await commentModel.findById(req.body.commentId)
        // check if post is deleted
        if(post.isDeleted) next(new AppError("post is deleted", 404))
        // check if comment not found
        if(!comment) return next(new AppError("comment not found", 404))
        // check if user is deleted
        if(req.user.isDeleted) return next(new AppError("Your account has been deleted", 400))
        // create comment
        req.body.createdBy = req.user.id
        const replay = await commentReplyModel.create(req.body)
        await commentModel.findByIdAndUpdate(comment._id,
             {$addToSet: {replies: replay._id}}, {new: true })

        return res.status(201).json({message: "success", replay})
    }
)

// update Replay comment
export const editReplay = catchError(
    async (req ,res, next)=>{
        const post = await postModel.findById(req.body.postId)
        const comment = await commentModel.findById(req.body.commentId)
        const replay = await commentReplyModel.findById(req.body.replayId)
        // check if replay not found
        if(!replay) return next(new AppError("Replay not found", 404))
        // check if post is deleted
        if(post.isDeleted) next(new AppError("post is deleted", 404))
        // check if comment not found
        if(!comment) return next(new AppError("comment not found", 404))
        // check if user is deleted
        if(req.user.isDeleted) return next(new AppError("Your account has been deleted", 400))
        // comment owner only
        if (comment.createdBy.toString() !== req.user.id.toString()) {
            return next(new AppError('You are not authorized to update this replay', 401))
        }
        // update comment in database and save it
        const updatedReplay = await commentReplyModel.findOneAndUpdate({_id: replay._id},
                {replyBody: req.body.replyBody}, {new: true})

        return res.status(200).json({message: "success", replay: updatedReplay});
})

// Delete Replay comment
export const deleteReplay = catchError(
    async (req, res, next)=>{
        const replayId = req.params.id
        const replay = await commentReplyModel.findById(replayId)
        // check if replay not found
        if(!replay) return next(new AppError("comment not found", 404))
        // replay owner only
        if (replay.createdBy.toString()!== req.user.id.toString()) {
            return next(new AppError('You are not authorized to delete this replay', 401))
        }
        // delete replay in database and save it
        await commentReplyModel.findOneAndDelete({_id: replayId})

        return res.status(200).json({message: "success"});
})

// like Replay comment 
export const likeReplay = catchError(
    async (req, res, next) => {
        const replayId = req.body.replayId
        const replay = await commentReplyModel.findById(replayId)
        // check if replay not found
        if(!replay) return next(new AppError("Replay not found", 404))
        // check if user already like this comment
        if(replay.likes.includes(req.user.id)) return next(new AppError("You already like this comment", 400))
        // like post
        replay.likes.push(req.user.id)
        await replay.save()
        return res.status(200).json({message: "success"})
})
    
// unlike Replay comment 
export const unlikeReplay = catchError(
    async (req, res, next) => {
        const replayId = req.body.replayId
        const replay = await commentReplyModel.findById(replayId)
        if(!replay){
            return next(new AppError("replay not found", 404))
        }
        // check if user already unlike this replay
        if(!replay.likes.includes(req.user.id)){
            return res.status(400).json({message: "You already unlike this replay"})
        }
        // unlike replay
        replay.likes.pull(req.user.id)
        await replay.save()
        return res.status(200).json({message: "success"})
})
