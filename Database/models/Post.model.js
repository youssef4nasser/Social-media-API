import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema({
    content: {
        type : String,
        required:[true,"Content is required"],
        trim: true,
    },
    images: [{
        secure_url: String,
        public_id: String
    }],
    video: {
        secure_url: String,
        public_id: String
    },
    likes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment'
    }],
    createdBy :{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    privacy :{
        type: String,
        enum: ['only', 'public'],
        default:'public'
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const postModel = model('post', postSchema)