import mongoose, { Schema, model, models } from "mongoose";

const CartItemSchema = new Schema({
    artId: {
        type: Schema.Types.ObjectId,
        ref: "Art",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
});

const CartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [CartItemSchema],
    },
    {
        timestamps: true,
    }
);

const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
