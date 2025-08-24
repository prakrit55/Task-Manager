import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { string } from 'joi';
import User from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const protect = async( req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        let authheader = req.headers.authorization;

        if (typeof authheader === "string" && authheader.startsWith("Bearer")) {
            token = authheader.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "message unauthorized !" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN as string) as {
            id: string
        };
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, no token could be found" })
    }
}

export const adminonly = async (req:Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin" ) {
        next();
    }
    else {
        res.status(403).json({ message: "Access Denied, Admin Only" })
    }
};