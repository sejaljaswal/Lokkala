import mongoose, { Schema, model, models } from "mongoose";
import "./User";
import "./Art";

const PurchaseSchema = new Schema(
    {
        art: {
            type: Schema.Types.ObjectId,
            ref: "Art",
            required: [true, "Purchase must be linked to an artwork"],
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Purchase must be linked to a buyer"],
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Purchase must be linked to an artist"],
        },
        price: {
            type: Number,
            required: [true, "Purchase price is required"],
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compiling the model if it already exists
const Purchase = models.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
