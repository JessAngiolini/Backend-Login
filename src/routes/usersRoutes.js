import {Router} from "express";
import { saveRegister, LoginCtrl, recoverPassword, resetPassword } from '../controllers/usersControllers';

const router = Router();
router.post("/register", saveRegister)
router.post('/login', LoginCtrl) 
router.post('/recover-password', recoverPassword);
router.put('/reset-password',resetPassword);

export default router; 