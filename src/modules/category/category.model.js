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

CategorySchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            isRemoved: this.isRemoved,
            image: this.image,
            createdAt: this.createdAt,
        }
    }
}
export default mongoose.model("Category", CategorySchema);