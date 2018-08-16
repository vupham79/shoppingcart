import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        unique: true,
        required: true,
    },
    content: {
        type: String,
    },
    isRemoved: {
        type: Boolean,
        default: false
    }
}, { timestamp: true });

BlogSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            owner: this.owner,
            title: this.title,
            content: this.content,
            isRemoved: this.isRemoved,
            createdAt: this.createdAt,
        }
    }
};

export default mongoose.model("Blog", BlogSchema);