import multer from "multer";
import { AppError } from "./AppError.js";

export const fileValidation = {
    flies: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mpeg"],
}

export function fileUpload(customValidation = []){
    const storage = multer.diskStorage({});
    
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid format", 401), false);
        }
    }

    const upload = multer({storage, fileFilter });
    return upload;
}
