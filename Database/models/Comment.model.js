import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
    commentBody: {
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    PostId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'post'
    },
    replies: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'commentReplay'
    }],
    likes:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }],
}, {
    timestamps: true
})

export const commentModel = model('comment', commentSchema)