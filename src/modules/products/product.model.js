import mongoose, { Schema } from 'mongoose';
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    status: {
        type: String,
        default: "Availble",
    },
    image: {
        type: String,
        default: "../../assets/image/default.jpg",
    },
    price: {
        type: Number,
        min: 0,
        default: 0,
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

ProductSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            category: this.category,
            image: this.image,
            price: this.price,
            quantity: this.quantity
        }
    }
}

export default mongoose.model("Product", ProductSchema);