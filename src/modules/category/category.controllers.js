import HTTPStatus from 'http-status';
import Category from './category.model';

export async function getCategoryList(req, res) {
    try {
        const categories = await Category.find({ isRemoved: false });
        return res.status(HTTPStatus.OK).json({ categories });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function getCategory(req, res) {
    try {
        const category = await Category.findOne({ name: req.params.id });
        return res.status(HTTPStatus.OK).json({ category });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function createCategory(req, res) {
    try {
        const category = await Category.create(req.body);
        return res.status(HTTPStatus.OK).json({ category });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function updateCategory(req, res) {
    try {
        const category = await Category.findOneAndUpdate({ name: req.params.id }, { image: req.body.image });
        return res.status(HTTPStatus.OK).json(category);
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};

export async function deleteCategory(req, res) {
    try {
        const category = await Category.findOneAndRemove({ name: req.params.id });
        return res.status(HTTPStatus.OK).json({ category });
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
};




