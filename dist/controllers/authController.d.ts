import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
export declare const login: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map