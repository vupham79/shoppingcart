import HTTPStatus from 'http-status';
import Category from '../category/category.model';
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
        .findOne({ isRemoved: false, name: req.params.id })
        .populate('category', 'name');
        return res.status(HTTPStatus.OK).json({ product });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

export async function createProduct(req, res) {
    try {
        const product = await Product.create(req.body);
        return res.status(HTTPStatus.OK).json({ product });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
}

export async function updateProduct(req, res) {
    try {
        const product = await Product.findOne({ isRemoved: false, name: req.params.id });
        const categoryId = await Category.findOne({ name: req.body.category })._id;
        console.log(categoryId);
        return res.status(HTTPStatus.OK).json(product);
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findOne({ isRemoved: false, name: req.params.id });
        product.isRemoved = true;
        product.save();
        return res.status(HTTPStatus.OK).json(product);
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
};

