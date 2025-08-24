import { Router } from "express";
import { uploadImage } from "../../utils/multer";
import { get, update, remove } from '../../controllers/admin/account-controller';

const router = Router();

router.get('/', get);
router.patch('/update', uploadImage, update);
router.delete('/delete', remove);

export default router;