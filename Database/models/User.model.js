import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName:{
        type: String,
        required:[true,"Name is required"],
        trim: true,
        maxlength: [25, "Max length 25"]
    },
    firstName: {
        type : String,
        // required:[true,"Name is required"],
        trim: true,
        maxlength: [25, "Max length 25"]
    },
    lastName: {
        type : String,
        // required:[true,"Name is required"],
        trim: true,
        maxlength: [25, "Max length 25"]
    },
    email: {
        type :String,
        unique : true,
        required:[true, "Emali is required"],
    },
    password: {
        type: String,
        required:[true, "Passowrd is required"],
    },
    phone:{
        type: String,
        required:[true,"Phone is required"],
    },
    age:{
        type: Number,
        required:[true,"Age is required"],
    },
    profileImage: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String
    }],
    confirmEmail:{
        type: Boolean ,
        default: false
    },
    codeConfirm:{
        type: String,
    },
    expireDateCode:{
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', function () {
      const fullName = this.fullName.split(' ');
      this.firstName = fullName[0];
      this.lastName = fullName.slice(1).join(' ');
});

export const userModel = model('user', userSchema)