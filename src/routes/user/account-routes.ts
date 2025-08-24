import { Router } from "express";
import { uploadImage } from "../../utils/multer";
import { get, update, remove, transferPoint } from '../../controllers/user/account-controller';

const router = Router();

router.get('/', get);
router.patch('/update', uploadImage, update);
router.patch('/transfer-points', transferPoint);
router.delete('/delete', remove);

export default router;