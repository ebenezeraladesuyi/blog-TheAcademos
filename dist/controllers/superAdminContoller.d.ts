import type { Response, Request } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare const createAdmin: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllAdmins: (_req: Request, res: Response) => Promise<void>;
export declare const deleteAdmin: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=superAdminContoller.d.ts.map