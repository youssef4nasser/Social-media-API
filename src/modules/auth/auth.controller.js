import jwt  from "jsonwebtoken"
import { userModel } from "../../../Database/models/User.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/CatchError.js"
import bcrypt from 'bcryptjs'
import { htmlEmailTemplate } from "../../utils/htmlEmailCode.js"
import { sendEmail } from "../../utils/email.js"
import { nanoid } from "nanoid"
import crypto from 'crypto-js'

// Register new user
export const register = catchError(
    async(req,res, next)=>{
        const {fullName, email, age, phone, password} = req.body
        // message for user if he register after with the same email
        const isExists = await userModel.findOne({email: email})
        if (isExists) return next(new AppError("Email already exists", 401))
        // generate conde  confirm
        const codeConfirm = nanoid(6)
        // Send email for user to confirm his email
        sendEmail(email, "Confirm your Email", htmlEmailTemplate(codeConfirm))
        // hash Password
        const hashedPassword = bcrypt.hashSync(password, 8);
        // encrypt phone
        const encryptPhone = crypto.AES.encrypt(phone, 'ILoveWebDevelopment').toString()
        // create new user
        const user = new userModel({
            fullName,
            email,
            age,
            phone: encryptPhone,
            password: hashedPassword,
            codeConfirm: codeConfirm,
        })
        await user.save()
        res.status(201).json({message: "success"})
})

// confirm email
export const confirmEmail = catchError(
    async(req, res, next)=>{
        const {email, codeConfirm} = req.body
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('User not found', 401))
        // if user confirmed his email before
        if(user?.confirmEmail) return next(new AppError('your email confirmed before', 401))
        // code not same 
        if (user.codeConfirm !== codeConfirm) return next(new AppError('Invalid code', 401))
        // update model and save it
        user.codeConfirm = null
        user.confirmEmail = true
        user.save()
        res.status(201).json({message: "success", user})
    }
)

// LgoIn
export const logIn = catchError(
    async(req, res, next)=>{
        const{email ,password}=req.body;
        // find user
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('User not found', 401))
        // if deleted
        if (user.isDeleted) return next(new AppError('User deleted', 401))
        // if password wrong
        if (!(bcrypt.compareSync(password, user?.password))) return next(new AppError('Invalid password', 401))
        // must be confirmed 
        if(user.confirmed == false) return next(new AppError('You must confirm your email first', 401))
        // generate an access token
        const token = jwt.sign({email: user.email, name: user.name, id: user._id, role: user.role},
            process.env.JWT_SECRET, {expiresIn:'1h'})
        res.status(201).json({message: 'success', token})    
    }
)

// forget password
export const forgetPassword = catchError(
    async (req, res, next) => {
        const {email} = req.body
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('User not found', 401))
        // generate code
        const codeConfirm = nanoid(6)
        // Time expire code
        const expireDateCode = Date.now() + 5 * 60 * 1000;
        // Send email for user to confirm his email
        sendEmail(user.email, "Your Password Reset Code (Valid 5 minutes)", htmlEmailTemplate(codeConfirm))
        // update model and save it
        user.expireDateCode = expireDateCode
        user.codeConfirm = codeConfirm
        user.save()
        res.status(201).json({message: "Reset code sent to your email"})
    }
)

// Verify Code and update password
export const resetPassword = catchError(
    async (req, res, next) => {
        const {email, codeConfirm, newPassword} = req.body
        // find user
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('user not found', 401))
        // check codeConfirm
        if(user.codeConfirm !== codeConfirm || user.expireDateCode < Date.now()) return next(new AppError('Invalid reset code or expired', 401))
        // hash Password
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        // update model and save it
        user.codeConfirm = null
        user.password = hashedPassword
        user.save()
        res.status(201).json({message: "success", user})
    }
)
