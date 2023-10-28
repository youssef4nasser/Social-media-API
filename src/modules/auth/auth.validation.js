import Joi from "joi";

export const registerValidation = Joi.object({
    fullName: Joi.string().min(2).max(25).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).max(25).required(),
    age: Joi.number().required(),
    phone: Joi.string().required(),
})

export const loginValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).max(25).required()
})

export const confirmValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    codeConfirm: Joi.string().length(6).required()
})

export const forgetPasswordValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
})

// resetPassword validation
export const resetPasswordValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    codeConfirm: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).max(25).required()
})


