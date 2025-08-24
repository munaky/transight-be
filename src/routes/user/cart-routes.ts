import { Router } from "express";
import { getAll, add, update, remove, clear, checkout } from "../../controllers/user/cart-controller";

const router = Router();

router.get('/', getAll);
router.post('/add', add);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);

router.delete('/clear', clear);
router.post('/checkout', checkout);

export default router;