import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true, // removes whitespace from both ends of the string
        lowercase: true,
        index: true // able to search by username 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // removes whitespace from both ends of the string
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true, // removes whitespace from both ends of the string
        index: true // able to search by fullname
    },
    avatar: {
        type: String,
        required: true,

    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: null, // initially no refresh token is generated
    }

},
    {
        timestamps: true, // automatically adds createdAt and updatedAt fields
    }
)

//! hash the password before saving the user
userSchema.pre("save", async function (next) {
    // isModified checks if the password field is modified if yes then only then hash the password
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
})

// check if the password is correct by comparing with the hashed password stored in the database
// making our own methods 
//! await is used in JavaScript (especially with async functions) to pause the execution of a function until a Promise is resolved or rejected. It makes asynchronous code easier to read and write.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
    // in result it returns true or false 
}


// generate access 
userSchema.methods.generateAccessToken = function () {
    // hold this in variable or directly return it 
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" // default expiry time is 1 hour"
        }
    )
}

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    // both access and refresh tokens are same but referesh token has few details 
    return jwt.sign({
        _id: this._id,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "1h" // default expiry time is 1 hour"
        }
    )
}


export const User = mongoose.model("User", userSchema)
