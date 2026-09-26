import { Router } from "express";
import { adminOnly, protect } from "../middleware/auth.js";
import { changePassword, login } from "../controllers/authController.js";
const authRouter = Router();
authRouter.post("/login", login);
authRouter.post("/change-password", protect, adminOnly, changePassword);
export default authRouter;
//# sourceMappingURL=authRoutes.js.map