import HTTPStatus from 'http-status';
import Category from './category.model';
import Product from '../products/product.model';

export async function getCategoryList(req, res) {
    try {
        const categories = await Category
            .find({ isRemoved: false })
        return res.status(HTTPStatus.OK).json({ categories });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function getCategory(req, res) {
    try {
        const product = await Product
            .find({ isRemoved: false, category: req.params.id })
            .populate('category', 'name');
        if (!product) {
            return res.status(HTTPStatus.BAD_REQUEST).send("Category không tìm thấy");
        }
        return res.status(HTTPStatus.OK).json({ product });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function createCategory(req, res) {
    try {
        const category = await Category.create(req.body);
        return res.status(HTTPStatus.OK).json({ category });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function updateCategory(req, res) {
    try {
        const category = await Category.findOne({ isRemoved: false, _id: req.params.id });
        if (!category) {
            return res.status(HTTPStatus.BAD_REQUEST).send("Category không tìm thấy");
        }
        if (req.body.name) {
            category.name = req.body.name;
        }
        if (req.body.image) {
            category.image = req.body.image;
        }
        category.save();
        return res.status(HTTPStatus.OK).json(category);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function deleteCategory(req, res) {
    try {
        const products = await Product
            .update(
                //Query
                { isRemoved: false, category: req.params.id },
                //Content to update && Must use $set because we use 'multi'
                { $set: { isRemoved: true } },
                //Update multi document
                { multi: true }
            );
        const category = await Category
            .findOneAndUpdate(
                //Query
                { isRemoved: false, _id: req.params.id },
                //Content to update
                { isRemoved: true }
            );
        if (!category) {
            return res.status(HTTPStatus.BAD_REQUEST).send("Category không tồn tại");
        }
        return res.status(HTTPStatus.OK).json({ category });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};




