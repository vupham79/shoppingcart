import HTTPStatus from 'http-status';
import Product from './product.model';

export async function getProductList(req, res) {
    try {
        const products = await Product
            .find({ isRemoved: false })
            .populate('category', 'name');
        return res.status(HTTPStatus.OK).json({ products });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

export async function getProduct(req, res) {
    try {
        const product = await Product
            .findOne({ isRemoved: false, _id: req.params.id })
            .populate('category', 'name');
        if (product) {
            return res.status(HTTPStatus.OK).json({ product });
        } else {
            return res.status(HTTPStatus.BAD_REQUEST).send("Sản phẩm không tồn tại");
        }
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

export async function createProduct(req, res) {
    try {
        if (req.body.quantity >= 0) {
            req.body.status = "Còn hàng";
        } else {
            req.body.status = "Hết hàng";
        }
        const product = await Product.create(req.body);
        return res.status(HTTPStatus.OK).json({ product });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
}

export async function updateProduct(req, res) {
    try {
        const product = await Product.findOne({ isRemoved: false, _id: req.params.id });
        if (product) {
            if (req.body.name) {
                product.name = req.body.name;
            }
            if (req.body.category) {
                product.category = req.body.category;
            }
            if (req.body.image) {
                product.image = req.body.image;
            }
            if (req.body.price) {
                product.price = req.body.price;
            }
            if (req.body.quantity >= 0) {
                product.quantity = req.body.quantity;
                if (req.body.quantity === 0) {
                    product.status = "Hết hàng";
                } else {
                    product.status = "Còn hàng";
                }
            }
            await product.save();
            return res.status(HTTPStatus.OK).json(product);
        } else {
            return res.status(HTTPStatus.BAD_REQUEST).send("Sản phẩm không tồn tại");
        }
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findOneAndUpdate(
            //Query
            { isRemoved: false, _id: req.params.id },
            //Content to update
            { isRemoved: true },
        )
        if (product) {
            return res.status(HTTPStatus.OK).json(product);
        } else {
            return res.status(HTTPStatus.BAD_REQUEST).send("Sản phẩm không tồn tại");
        }
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

