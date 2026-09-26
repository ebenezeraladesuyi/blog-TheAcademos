import type { Request, Response, NextFunction } from "express";
import jwt, { type Jwt } from "jsonwebtoken";
import type { IblogAdmin } from "../models/adminModel.js";
import blogAdminModel from "../models/adminModel.js";


export interface AuthRequest extends Request {
    user?: IblogAdmin;
}

interface JwtPayload {
    id: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
const authHeader = req.headers.authorization;

if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({
            success: false,
            message: "invalid token format"
        })
        return
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as unknown as JwtPayload;

      const user = await blogAdminModel.findById(decoded.id);
      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      req.user = user;
      next();
      
    } catch {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token provided" });
  }
};


export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: "Admin access only"
        })
    }
};


export const superAdminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && req.user.role === "superAdmin") {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: "SuperAdmin access only"
        })
    }
}