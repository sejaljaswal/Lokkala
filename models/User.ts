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
        bio: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800&auto=format&fit=crop",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compiling the model if it already exists
const User = models.User || model("User", UserSchema);

export default User;
