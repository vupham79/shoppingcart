import HttpStatus from 'http-status';
import Order from './order.model';
import Customer from '../users/user.model';
import Product from '../products/product.model';
import Fawn from 'fawn';

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
        const order = await Order.findOne({ isRemoved: false, id: req.params.id }).populate("products.product customer", "phone name id price");
        if (order) {
            if (req.params.user != order.customer._id) {
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
    try {
        //Get the Customer Object ID from db
        req.body.customer = (await Customer.findOne({ isRemoved: false, phone: req.body.customer }))._id;

        //Initialize to check if order id existed?
        const order = await Order.create({
            id: req.body.id,
            customer: req.body.customer,
            address: req.body.address
        })

        var total = 0; //Total money
        var errorMessage = "";
        var convertedProduct = [];
        //Create batch transactions by Fawn
        var tasks = Fawn.Task()

        //Change product in request into object id ref in Product model
        for (let i = 0; i < req.body.products.length; i++) {
            const product = await Product.findOne({ isRemoved: false, id: req.body.products[i].product });
            if (product.quantity <= 0 || product.quantity < req.body.products[i].quantity) {
                errorMessage = `${product.name} không đủ hàng\n` + errorMessage;
            } else {
                if (errorMessage.length === 0) {
                    tasks.update("products", { isRemoved: false, id: req.body.products[i].product }, { $inc: { quantity: -req.body.products[i].quantity } });
                    if (product.price != "Giá liên hệ") {
                        total = parseFloat(product.price) * req.body.products[i].quantity + total;
                    }
                    if (convertedProduct.length > 0) {
                        let flag = false;
                        for (let j = 0; j < convertedProduct.length; j++) {
                            if (String(product._id) === String(convertedProduct[j].product)) {
                                convertedProduct[j].quantity += req.body.products[i].quantity;
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            convertedProduct.push({
                                product: product._id,
                                quantity: req.body.products[i].quantity
                            });
                        }
                    } else {
                        convertedProduct.push({
                            product: product._id,
                            quantity: req.body.products[i].quantity
                        });
                    }
                }
            };
        };
        if (errorMessage.length > 0) {
            await Order.findOneAndRemove({ isRemoved: false, id: req.body.id });
            return res.status(HttpStatus.BAD_REQUEST).send({ errorMessage });
        } else if (convertedProduct.length <= 0) {
            await Order.findOneAndRemove({ isRemoved: false, id: req.body.id });
            return res.status(HttpStatus.BAD_REQUEST).send("Tạo order thất bại");
        } else {
            //Perform tasks batch
            tasks.run()
                .then(async () => {
                    order.products = convertedProduct;
                    order.total = total;
                    await order.save();
                    return res.status(HttpStatus.OK).json({ order });
                })
                .catch(async err => {
                    await Order.findOneAndRemove({ isRemoved: false, id: req.body.id });
                    return res.status(HttpStatus.BAD_REQUEST).json(err);
                })
        }
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function updateOrder(req, res) {
    try {
        if (req.body.products) {
            //Find old order
            const order = await Order.findOne({ isRemoved: false, id: req.params.id }).populate("products.product");
            if (!order) {
                return res.status(HttpStatus.BAD_REQUEST).send("Order không tồn tại");
            }

            //Create batch transactions by Fawn
            var tasks = Fawn.Task()
            var errorMessage = "";
            var convertedProduct = [];
            var total = 0;

            //Return the quantity of products back
            for (let i = 0; i < order.products.length; i++) {
                // const product = await Product.findOne({ isRemoved: false, id: order.products[i].product.id });
                tasks.update("products", { isRemoved: false, _id: order.products[i].product._id }, { $inc: { quantity: order.products[i].quantity } });
            }

            //Change product in request into object id ref in Product model
            for (let i = 0; i < req.body.products.length; i++) {
                const product = await Product.findOne({ isRemoved: false, id: req.body.products[i].product });
                if (!product) {
                    return res.status(HttpStatus.BAD_REQUEST).send(`Không tìm thấy sản phẩm ${req.body.products[i].product}`);
                }
                if (product.quantity <= 0 || product.quantity < req.body.products[i].quantity) {
                    errorMessage = `${product.name} không đủ hàng\n` + errorMessage;
                } else {
                    tasks.update("products", { isRemoved: false, id: req.body.products[i].product }, { $inc: { quantity: -req.body.products[i].quantity } });
                    if (product.price != "Giá liên hệ") {
                        total = parseFloat(product.price) * req.body.products[i].quantity + total;
                    }
                    if (convertedProduct.length > 0) {
                        let flag = false;
                        for (let j = 0; j < convertedProduct.length; j++) {
                            if (String(product._id) === String(convertedProduct[j].product)) {
                                convertedProduct[j].quantity += req.body.products[i].quantity;
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            convertedProduct.push({
                                product: product._id,
                                quantity: req.body.products[i].quantity
                            });
                        }
                    } else {
                        convertedProduct.push({
                            product: product._id,
                            quantity: req.body.products[i].quantity
                        });
                    };
                };
            };
            if (errorMessage.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).send({ errorMessage });
            } else {
                //Perform tasks batch
                tasks.run()
                    .then(async () => {
                        if (errorMessage.length > 0) throw err;
                        order.products = convertedProduct;
                        order.total = total;
                        if (req.body.address) {
                            order.address = req.body.address;
                        }
                        await order.save();
                        return res.status(HttpStatus.OK).json({ order });
                    })
            }
        } else
            if (req.body.address) {
                //Find old order
                const order = await Order.findOneAndUpdate({ isRemoved: false, id: req.params.id }, { address: req.body.address });
                return res.status(HttpStatus.OK).json({ order });
            }
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}

export async function deleteOrder(req, res) {
    try {
        const order = await Order.findOneAndUpdate({ isRemoved: false, id: req.params.id }, { isRemoved: true }).populate("products.product", "id name price");
        if (order) {
            return res.status(HttpStatus.OK).json(order);
        } else {
            return res.status(HttpStatus.BAD_REQUEST).send("Order không tồn tại");
        }
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
}