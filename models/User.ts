import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your full name"],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ["artist", "buyer"],
            default: "buyer",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compiling the model if it already exists
const User = models.User || model("User", UserSchema);

export default User;
