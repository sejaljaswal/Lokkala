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
        shippingStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered"],
            default: "processing",
        },
        estimatedDelivery: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        shippingAddress: {
            fullName: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            pincode: String,
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            default: "cod",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compiling the model if it already exists
const Purchase = models.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
