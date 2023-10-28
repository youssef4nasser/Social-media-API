import Joi from "joi";

export const updateProfileValidation = Joi.object({
    firstName: Joi.string().min(2).max(25),
    lastName: Joi.string().min(2).max(25),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number(),
    phone: Joi.string(),
})

export const confirmValidation = Joi.object({
    codeConfirm: Joi.string().length(6).required()
})

export const updatePasswordValidation = Joi.object({
    oldPassword: Joi.string().min(6).max(25).required(),
    newPassword: Joi.string().min(6).max(25).required(),
})