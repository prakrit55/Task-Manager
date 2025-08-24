import { boolean, number, required } from 'joi';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        minLength: 5,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        select: false, // Do not return password in queries
    },
    imageUrl: {
        type: String,
    },
    verified:{
        type: Boolean,
        select: false,
    },
    verificationcode:{
        type: String,
        select: false,
    },
    verificationCodeValidation: {
            type: Number,
            select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "manager"],
    },
    profileImageUrl: {
        type: String,
        default: null
    },
    resetpasswordsess: {
        type: Number,
        select: false,
    },
    resetpasswordcode: {
        type: String,
        select: false,
    },
},{
    timestamps: true,
    versionKey: false,
})

export default mongoose.model('User', userschema);