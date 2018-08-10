import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Availble",
    },
    image: {
        type: String,
        default: "../../default.jpg",
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Product", ProductSchema);