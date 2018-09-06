import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                min: 0,
                defaut: 0,
            }
        }
    ],
    total: {
        type: Number,
        min: 0,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    },
    isRemoved: {
        type: Boolean,
        default: false,
    }
}, {
        timestamps: true,
    });

OrderSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            id: this.id,
            customer: this.customer,
            products: this.products,
            total: this.total,
            address: this.address,
            status: this.status,
            isRemoved: this.isRemoved,
        }
    }
}

export default mongoose.model('Order', OrderSchema);