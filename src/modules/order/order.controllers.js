import HttpStatus from 'http-status';
import Order from './order.model';
import Customer from '../users/user.model';
import Product from '../products/product.model';
import mongoose from 'mongoose';
import Fawn from 'fawn';
import { throws } from 'assert';

export async function getOrders(req, res) {
    try {
        const orders = await Order
            .find({ isRemoved: false })
            .populate('customer', 'name phone')
            .populate('products.product', 'id name price');
        return res.status(HttpStatus.OK).json({ orders });
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function getOrder(req, res) {
    try {
        const order = await Order.findOne({ isRemoved: false, _id: req.params.id }).populate("products.product customer", "phone name id price");
        if (order) {
            if (String(req.user._id) != String(order.customer._id)) {
                return res.status(HttpStatus.BAD_REQUEST).send("Không được quyền truy cập");
            }
            return res.status(HttpStatus.OK).json({ order });
        }
        return res.status(HttpStatus.BAD_REQUEST).send("Order không tồn tại");
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function createOrder(req, res) {
    var isCreated = false;
    try {
        //Get the Customer Object ID from db
        req.body.customer = (await Customer.findOne({ isRemoved: false, _id: req.user._id }))._id;
        if (!req.body.customer) {
            return res.status(HttpStatus.BAD_REQUEST).send("Tài khoản không tồn tại");
        }
        //Initialize to check if order id existed?
        var order;
        if (! await Order.findOne({ isRemoved: false, id: req.body.id })) {
            order = await Order.create({
                id: req.body.id,
                customer: req.body.customer,
                address: req.body.address
            });
            isCreated = true;
        } else {
            return res.status(HttpStatus.BAD_REQUEST).send("Order ID đã tồn tại");
        }

        var total = 0; //Total money
        var errorMessage = "";
        var convertedProduct = [];
        //Create batch transactions by Fawn
        var tasks = Fawn.Task();

        //Change req products into right shape
        for (let i = 0; i < req.body.products.length; i++) {
            if (convertedProduct.length > 0) {
                //Fix duplicate product in req
                let duplicate = false;
                for (let j = 0; j < convertedProduct.length; j++) {
                    if (convertedProduct[j].product === req.body.products[i].product) {
                        convertedProduct[j].quantity += req.body.products[i].quantity;
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate) {
                    convertedProduct.push(req.body.products[i]);
                }
            } else {
                convertedProduct.push(req.body.products[i]);
            }
        }
        req.body.products = convertedProduct;
        order.products = convertedProduct;
        /*-------------------------------------*/

        //Doing Business
        for (let i = 0; i < req.body.products.length; i++) {
            try {
                const product = await Product.findOne({ isRemoved: false, _id: req.body.products[i].product });
                if (product.quantity <= 0 || product.quantity < req.body.products[i].quantity) {
                    errorMessage += `${product.id} không đủ hàng\n`;
                } else {
                    //Calculate total
                    if (product.price != "Giá liên hệ") {
                        total += parseFloat(product.price) * req.body.products[i].quantity;
                    }
                    //Reduce product quantity in DB
                    await tasks.update("products", { isRemoved: false, _id: mongoose.Types.ObjectId(req.body.products[i].product) }, { $inc: { quantity: -req.body.products[i].quantity } });
                }
            } catch (error) {
                await Order.findOneAndRemove({ isRemoved: false, _id: order._id });
                return res.status(HttpStatus.BAD_REQUEST).send(`Không tìm thấy sản phẩm có _id: ${req.body.products[i].product}`);
            }
        };
        order.total = total;

        if (errorMessage.length > 0) {
            await Order.findOneAndRemove({ isRemoved: false, _id: order._id });
            return res.status(HttpStatus.BAD_REQUEST).send({ errorMessage });
        } else if (convertedProduct.length <= 0) {
            await Order.findOneAndRemove({ isRemoved: false, _id: order._id });
            return res.status(HttpStatus.BAD_REQUEST).send("Tạo order thất bại");
        } else {
            //Perform tasks batch
            tasks.run()
                .then(async () => {
                    await order.save();
                    return res.status(HttpStatus.OK).json({ order });
                })
                .catch(async err => {
                    await Order.findOneAndRemove({ isRemoved: false, id: order._id });
                    return res.status(HttpStatus.BAD_REQUEST).json(err);
                })
        }
    } catch (error) {
        if (isCreated) {
            await Order.findOneAndRemove({ isRemoved: false, id: order._id });
        }
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function updateOrder(req, res) {
    try {
        console.log(req.body.products.length);
        if (req.body.products.length > 0) {
            //Find old order
            const order = await Order.findOne({ isRemoved: false, _id: req.params.id }).populate("products.product");
            if (String(order.customer) != String(req.user._id)) {
                return res.status(HttpStatus.BAD_REQUEST).send("Không được quyền truy cập");
            }
            //Create batch transactions by Fawn
            var retrieveProduct = Fawn.Task();
            var reduceProduct = Fawn.Task();
            var errorMessage = "";
            var total = 0;
            var convertedProduct = [];

            //Return the quantity of products back
            for (let i = 0; i < order.products.length; i++) {
                await retrieveProduct.update("products", { isRemoved: false, _id: order.products[i].product._id }, { $inc: { quantity: order.products[i].quantity } });
            }

            retrieveProduct.run()
                .then(async () => {
                    //Change req products into right shape
                    for (let i = 0; i < req.body.products.length; i++) {
                        if (convertedProduct.length > 0) {
                            //Fix duplicate product in req
                            let duplicate = false;
                            for (let j = 0; j < convertedProduct.length; j++) {
                                if (convertedProduct[j].product === req.body.products[i].product) {
                                    convertedProduct[j].quantity += req.body.products[i].quantity;
                                    duplicate = true;
                                    break;
                                }
                            }
                            if (!duplicate) {
                                convertedProduct.push(req.body.products[i]);
                            }
                        } else {
                            convertedProduct.push(req.body.products[i]);
                        }
                    }
                    req.body.products = convertedProduct;
                    order.products = convertedProduct;
                    /*---------------------------------------------------*/

                    //Doing Business
                    for (let i = 0; i < req.body.products.length; i++) {
                        try {
                            const product = await Product.findOne({ isRemoved: false, _id: req.body.products[i].product });
                            if (product.quantity <= 0 || product.quantity < req.body.products[i].quantity) {
                                errorMessage += `${product.id} không đủ hàng\n`;
                            } else {
                                //Calculate total
                                if (product.price != "Giá liên hệ") {
                                    total += parseFloat(product.price) * req.body.products[i].quantity;
                                }
                                //Reduce product quantity in DB
                                await reduceProduct.update("products", { isRemoved: false, _id: mongoose.Types.ObjectId(req.body.products[i].product) }, { $inc: { quantity: -req.body.products[i].quantity } });
                            }
                        } catch (error) {
                            throw `Không tìm thấy sản phẩm có _id: ${req.body.products[i].product}`;
                        }
                    };

                    if (errorMessage.length > 0) {
                        throw errorMessage;
                    } else {
                        //Perform tasks batch
                        reduceProduct.run()
                            .then(async () => {
                                 order.products = convertedProduct;
                                order.total = total;
                                if (req.body.address) {
                                    order.address = req.body.address;
                                }
                                await order.save();
                                return res.status(HttpStatus.OK).json({ order });
                            })
                    }
                })
                .catch((error) => {
                    return res.status(HttpStatus.BAD_REQUEST).send(error);
                })
        } else if (req.body.address) {
            //Find old order
            const order = await Order.findOne({ isRemoved: false, _id: req.params.id }).populate("products.product")
            if (!order) {
                return res.status(HttpStatus.BAD_REQUEST).send("Order không tồn tại");
            }
            if (String(order.customer) != String(req.user._id)) {
                return res.status(HttpStatus.BAD_REQUEST).send("Không được quyền truy cập");
            }
            order.address = req.body.address;
            await order.save();
            return res.status(HttpStatus.OK).json({ order });
        }
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
}

export async function deleteOrder(req, res) {
    try {
        const order = await Order.findOne({ isRemoved: false, _id: req.params.id }).populate("products.product", "id name price");
        if (order) {
            if (String(order.customer) === String(req.user._id)) {
                order.isRemoved = true;
                await order.save();
                return res.status(HttpStatus.OK).json(order);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).send("Không được quyền truy cập");
            }
        } else {
            return res.status(HttpStatus.BAD_REQUEST).send("Order không tồn tại");
        }
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}