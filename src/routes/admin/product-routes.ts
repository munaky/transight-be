import { Router } from "express";
import { getAll, get, create, update, remove, restore } from "../../controllers/admin/product-controller";
import { uploadImage } from '../../utils/multer';

const router = Router()

router.get('/', getAll);
router.get('/get/:id', get);
router.post('/create', uploadImage, create);
router.patch('/update/:id', uploadImage, update);
router.patch('/:id/restore', restore);
router.delete('/delete/:id', remove);

export default router;