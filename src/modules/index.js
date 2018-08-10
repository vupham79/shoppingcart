import categoryRoutes from './category/category.routes';
import productRoutes from './products/product.routes';
import userRoutes from './users/user.routes';

export default app => {
    app.use('/user', userRoutes);
    app.use('/category', categoryRoutes);
    app.use('/product', productRoutes);
};