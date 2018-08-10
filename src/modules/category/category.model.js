import mongoose from 'mongoose';
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "../../default.jpg",
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

export default mongoose.model("Category", CategorySchema);