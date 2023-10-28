import mongoose, { Schema, model } from "mongoose";

const commentReplySchema = new Schema({
    replyBody: {
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    commentId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment'
    },
    likes:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }],
}, {
    timestamps: true
})

export const commentReplyModel = model('commentReply', commentReplySchema)