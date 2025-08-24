import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isUser } from "../../middlewares/isUser";
import accountRoutes from './account-routes';
import cartRoutes from './cart-routes';
import orderRoutes from './order-routes';
import produtsRoutes from './product-routes';

const router = Router();

router.use(isAuthenticated, isUser);

router.use('/account', accountRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/products', produtsRoutes);

export default router;