import { Router } from "express";
import { get, sendEmail } from "../controllers/n8n-controller";

const router = Router()

router.get('/', get);
router.post('/send-email', sendEmail);

export default router;