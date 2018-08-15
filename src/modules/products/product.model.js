import mongoose, { Schema } from 'mongoose';
const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    detail: {
        type: String,
    },
    image: {
        type: String,
        default: "../../assets/image/default.jpg",
    },
    status: {
        type: String,
        default: "Còn hàng",
    },
    price: {
        type: String,
        default: "Giá liên hệ",
    },
    quantity: {
        type: Number,
        default: 0,
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
            id: this.id,
            name: this.name,
            category: this.category,
            status: this.status,
            image: this.image,
            price: this.price,
            quantity: this.quantity,
            isRemoved: this.isRemoved,
        }
    }
}

export default mongoose.model("Product", ProductSchema);