import { userModel } from "../../../Database/models/User.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/CatchError.js"
import { htmlEmailTemplate } from "../../utils/htmlEmailCode.js"
import { sendEmail } from "../../utils/email.js"
import { nanoid } from "nanoid"
import crypto from 'crypto-js'
import bcrypt from 'bcryptjs'
import cloudinary from "../../utils/cloudinary.js"

// get user profile
export const getProfile = catchError(
    async (req, res, next) => {
        const user = await userModel.findById(req.user.id)
        return res.status(200).json({message:"success", user})
    }
)

// update user profile
export const updateProfile = catchError(
    async (req, res, next) => {
        const {firstName, lastName, email, age, phone} = req.body
        // check if email is changed
        if(email){
            // message for user if email is Exists
            const isExists = await userModel.findOne({email: email})
            if (isExists) return next(new AppError("Email already exists", 401))
            // generate conde  confirm
            const codeConfirm = nanoid(6)
            // Send email for user to confirm his email
            sendEmail(email, "Confirm your Email", htmlEmailTemplate(codeConfirm))
            // update model and save it
            req.user.confirmEmail = false
            req.user.codeConfirm = codeConfirm
        }
        // check if phone is changed
        if(phone){
            // encrypt phone
            const encryptPhone = crypto.AES.encrypt(phone, 'ILoveWebDevelopment').toString()
            // update model and save it
            req.user.phone = encryptPhone
        }
        req.user.save()
        // update model and save it
        const user = await userModel.findByIdAndUpdate(req.user.id, {
            firstName,
            lastName,
            email,
            age,
        }, {new: true})
        return res.status(200).json({message: 'success', user})
    }
)

// confirm new email
export const confirmNewEmail = catchError(
    async (req, res, next) => {
        const {codeConfirm} = req.body
        // get user
        const user = await userModel.findOne({email: req.user.email})
        // code not same (Invalid code)
        if(user.codeConfirm !== codeConfirm) return next(new AppError('Invalid code', 401))
        // update model and save it
        await userModel.findByIdAndUpdate(req.user.id, {
            confirmEmail: true,
            codeConfirm: null
            }, {new: true})
        return res.status(201).json({message: "success"})
    }
)

// add profile picture 
export const profileImage = catchError(
    async (req, res, next) => {           
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, 
              {folder: `/Exam/profile picture`});
        // Destroy the old image
        if (req.user.profileImage) {
            await cloudinary.uploader.destroy(req.user.profileImage.public_id);
        }
        // Update the user's profile image
        await userModel.findByIdAndUpdate(req.user.id,
                {profileImage: {secure_url, public_id}});

        return res.json({message: "success", image: secure_url});
    }
)

// add cover pictures
export const coverImages = catchError(
    async (req, res, next) => {           
        const coverImages = req.user.coverImages
        for (const file of req.files) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder: `/Exam/cover pictures`})
            coverImages.push({secure_url, public_id})
        }
        await userModel.findByIdAndUpdate(
            req.user.id,
            {coverImages},
        )
        return res.json({message: "success", images: coverImages})
    }
)

// update password
export const updatePassword = catchError(
    async (req, res, next) => {
        const { newPassword} = req.body
        // get user
        const user = await userModel.findById(req.user.id)
        // if user not found
        if (!user) return next(new AppError("User not found", 404))
        // check if password is changed
        const isMatch = await bcrypt.compare(newPassword, user.password)
        if (isMatch) return next(new AppError("new password must be different", 401))
        // update model and save it
        user.password = await bcrypt.hash(newPassword, 8) 
        user.save()
        return res.status(200).json({message: "success", user})
    }
)

// - SoftDelete profile by account owner only
export const softDeleteProfile = catchError(
    async (req, res, next) => {
        // get user
        const user = await userModel.findById(req.user.id)
        // if user not found
        if (!user) return next(new AppError("User not found", 404))
        // update model and save it
        user.isDeleted = true
        user.save()
        return res.status(200).json({message: "success", user})
    }
)

