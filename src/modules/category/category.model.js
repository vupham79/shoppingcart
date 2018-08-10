import mongoose from 'mongoose';
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "../../assets/image/default.jpg",
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

export default mongoose.model("Category", CategorySchema);