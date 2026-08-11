import { Router } from "express";
import {
  register,
  login,
  me,
  walletNonce,
  walletVerify,
} from "./auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

router.post("/wallet/nonce", authenticate, walletNonce);
router.post("/wallet/verify", authenticate, walletVerify);

export default router;