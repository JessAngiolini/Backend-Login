import {Router} from "express";
import { saveRegister, LoginCtrl, } from '../controllers/usersControllers';

const router = Router();
router.post("/register", saveRegister)
router.post('/login', LoginCtrl) 

export default router; 