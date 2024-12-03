import {Router} from "express";
import { signup } from "../controllers/authController";
const router = Router();

//auth Routes

router.post('/users/signup',signup)

export default router;