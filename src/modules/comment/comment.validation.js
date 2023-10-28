import Joi from "joi";

const idValidation =  Joi.string().hex().length(24).required()

export const addCommentValidation = Joi.object({
    commentBody: Joi.string().min(2).required(),
    PostId: idValidation
})

export const editCommentValidation = Joi.object({
    commentId: idValidation,
    commentBody: Joi.string().min(2).required()
})

export const likeValidation = Joi.object({
    commentId: idValidation
})

export const paramsValidation = Joi.object({
    id: idValidation
})
