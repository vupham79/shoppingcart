import HttpStatus from 'http-status';
import Order from './order.model';
import Customer from '../users/user.model';
import Product from '../products/product.model';

export async function getOrders(req, res) {
    try {
        const orders = await Order
            .find({ isRemoved: false })
            .populate('customer', 'name phone')
            .populate('products');
        return res.status(HttpStatus.OK).json({ orders });
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function getOrder(req, res) {
    try {
        const orders = await Order.findOne({ isRemoved: false, id: req.params.id }).populate('customer products');
        return res.status(HttpStatus.OK).json({ orders });
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function createOrder(req, res) {
    try {
        req.body.customer = (await Customer.findOne({ isRemoved: false, phone: req.body.customer }))._id;
        const products = await req.body.products.map(product => {
            console.log(product.product);
            return {
                product: product.product = (Product.findOne({ isRemoved: false, id: "'" + product.product + "'" }))._id,
                quantity: product.quantity
            }
        });
        console.log(products);
        req.body.products = products;
        const order = await Order.create(req.body);
        return res.status(HttpStatus.OK).json({ order });
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function updateOrder(req, res) {
    try {
        req.body.products.forEach(async (product, index) => {
            products[index].product = (await Product.findOne({ isRemoved: false, id: product.product.id }))._id;
        });
        return res.status(HttpStatus.OK).json(await Order.findOneAndUpdate({ isRemoved: false, _id: req.params.id }, { products: req.body.products }));
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function deleteOrder(req, res) {
    try {
        const order = await Order.findOneAndUpdate({ isRemoved: false, id: req.params.id }, { isRemoved: true });
        return res.status(HttpStatus.OK).json(order);
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}