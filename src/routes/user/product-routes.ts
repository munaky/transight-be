import { Router } from "express";
import { getAll, get } from "../../controllers/user/product-controller";

const router = Router();

router.get('/', getAll);
router.get('/get/:id', get);

export default router;