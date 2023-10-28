import Joi from "joi";

const idValidation =  Joi.string().hex().length(24).required()

export const addPostValidation = Joi.object({
    content: Joi.string().min(2).required()
})

export const getPostByIdValidation = Joi.object({
    id: idValidation
})

export const updatePostValidation = Joi.object({
    id: idValidation,
    content: Joi.string().min(2).required()
})

export const changePrivacyValidation = Joi.object({
    id: idValidation,
    privacy: Joi.string().valid('only', 'public'),
})

export const paramsValidation = Joi.object({
    id: idValidation
})
