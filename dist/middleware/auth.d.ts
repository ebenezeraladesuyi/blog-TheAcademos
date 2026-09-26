import type { Request, Response, NextFunction } from "express";
import type { IblogAdmin } from "../models/adminModel.js";
export interface AuthRequest extends Request {
    user?: IblogAdmin;
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const adminOnly: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const superAdminOnly: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map