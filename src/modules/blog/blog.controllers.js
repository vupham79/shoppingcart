import httpStatus from 'http-status';
import Blog from './blog.model';
import User from '../users/user.model';

export async function getBlogs(req, res) {
    try {
        const blogs = await Blog
            .find({ isRemoved: false })
            .populate('owner', 'name');
        return res.status(httpStatus.OK).json({ blogs });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
};

export async function getBlog(req, res) {
    try {
        const blog = await Blog
            .findOne({ isRemoved: false, _id: req.params.id })
            .populate('owner', 'name');
        if (!blog) {
            return res.status(httpStatus.BAD_REQUEST).send("Blog không tìm thấy");
        }
        return res.status(httpStatus.OK).json({ blog });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
};

export async function createBlog(req, res) {
    try {
        req.body.owner = (await User.findOne({ isRemoved: false, phone: req.body.owner }))._id;
        const blog = await Blog.create(req.body);
        return res.status(httpStatus.OK).json(blog);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
};

export async function deleteBlog(req, res) {
    try {
        const blog = await Blog.findOneAndUpdate(
            { isRemoved: false, _id: req.params.id },
            { isRemoved: true }
        )
        if (!blog) {
            return res.status(httpStatus.BAD_REQUEST).send("Blog không tồn tại");
        }
        return res.status(httpStatus.OK).json(blog);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
};

export async function updateBlog(req, res) {
    try {
        const ownerId = (await User.findOne({ isRemoved: false, _id: req.body.owner }))._id;
        if (!ownerId) {
            return res.status(httpStatus.BAD_REQUEST).send("Người sử dụng không tồn tại");
        }
        const blog = await Blog.findOne({ isRemoved: false, _id: req.params.id }, { title: req.body.title, owner: ownerId, content: req.body.content });
        if (!blog) {
            return res.status(httpStatus.BAD_REQUEST).send("Blog không tồn tại");
        }
        if (req.body.title) {
            blog.title = req.body.title;
        }
        if (req.body.owner) {
            blog.owner = req.body.owner;
        }
        if (req.body.content) {
            blog.content = req.body.content;
        }
        return res.status(httpStatus.OK).json({ blog });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}