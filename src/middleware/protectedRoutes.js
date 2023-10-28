import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/CatchError.js";
import { userModel } from "../../Database/models/User.model.js";

export const protectedRoutes = catchError(
    async (req, res, next)=>{
        const {token} = req.headers
        if(!token) return next(new AppError('TOKEN NOT PROVIDED', 401))

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id)
        if(!user)  return next(new AppError('Invalid token user not found', 401))

        req.user = user
        next()
    }
)