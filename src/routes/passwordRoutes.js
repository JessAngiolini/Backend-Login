import {Router} from "express";
import { recoverPassword, resetPassword } from "../controllers/usersControllers.js"

const router = Router();
router.post('/recover-password', recoverPassword);
router.put('/reset-password',resetPassword);

export default router;