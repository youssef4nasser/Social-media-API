import Joi from "joi";

const idValidation =  Joi.string().hex().length(24).required()

export const addReplayValidation = Joi.object({
    replyBody: Joi.string().min(2).required(),
    postId: idValidation,
    commentId: idValidation
})

export const editReplayValidation = Joi.object({
    replyBody:Joi.string().min(2).required(),
    postId: idValidation,
    commentId: idValidation,
    replayId: idValidation
})

export const paramsValidation = Joi.object({
    id: idValidation
})

export const likeReplayValidation = Joi.object({
    replayId: idValidation
})
