import { Router } from "express";
import { protect, superAdminOnly } from "../middleware/auth.js";
import { createAdmin, deleteAdmin, getAllAdmins } from "../controllers/superAdminContoller.js";
const superAdminRouter = Router();
superAdminRouter.use(protect, superAdminOnly);
superAdminRouter.post("/createadmin", createAdmin);
superAdminRouter.get("/getalladmin", getAllAdmins);
superAdminRouter.delete("/delete/:id", deleteAdmin);
export default superAdminRouter;
//# sourceMappingURL=superAdminRoutes.js.map