import mongoose, { Schema, model, models } from "mongoose";
import "./User";

const ArtSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for your artwork"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Please provide a price"],
        },
        category: {
            type: String,
            required: [true, "Please specify a category"],
            enum: ["Painting", "Pottery", "Sculpture", "Textile", "Jewelry", "Other"],
        },
        imageUrl: {
            type: String,
            required: [true, "Please provide an image URL"],
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "An artwork must be linked to an artist"],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compiling the model if it already exists
const Art = models.Art || model("Art", ArtSchema);

export default Art;
