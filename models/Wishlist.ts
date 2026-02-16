import mongoose, { Schema, model, models } from "mongoose";

const WishlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [{
            type: Schema.Types.ObjectId,
            ref: "Art",
        }],
    },
    {
        timestamps: true,
    }
);

const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);

export default Wishlist;
