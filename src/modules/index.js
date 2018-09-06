import categoryRoutes from './category/category.routes';
import productRoutes from './products/product.routes';
import userRoutes from './users/user.routes';
import blogRoutes from './blog/blog.routes';
import orderRoutes from './order/order.routes';

export default app => {
    app.use('/user', userRoutes);
    app.use('/category', categoryRoutes);
    app.use('/product', productRoutes);
    app.use('/blog', blogRoutes);
    app.use('/order', orderRoutes);
};