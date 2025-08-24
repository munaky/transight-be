import { Router } from "express";
import { register, login } from "../controllers/auth-controller";
import { uploadImage } from "../utils/multer";

const router = Router()

router.post('/register', uploadImage, register);
router.post('/login', login);

export default router;